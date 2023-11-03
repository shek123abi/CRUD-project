import React, { useEffect } from 'react';
import { ReactDOM } from 'react';
import { useState } from 'react';
export function Products(){
    const[content,setContent]=useState(<ProductList showForm={showForm}/>);
    function showList(){
        setContent(<ProductList showForm={showForm}/>);
    }
    function showForm(product){
        setContent(<ProductForm product={product} showList={showList}/>);
    }
    return(
        <div className="container my-5">
           {content}
           
        </div>
    )
}

function ProductList(props){
    const[products,setProducts]=useState([]);
    function fetchProducts(){
        fetch("http://localhost:3000/products")
        .then((response)=>{
            if(!response.ok){
                throw new Error("Unexpected server response");
            }

            return response.json();
        })
        .then((data)=>{
            // console.log(data)
            setProducts(data);

        })
        .catch((error)=>console.log("Error :",error));
    }
    // fetchProducts();
    useEffect(()=>fetchProducts(),[]);
    function deleteProduct(id){
        fetch("http://localhost:3000/products/"+id,{
            method:'DELETE'
        })
        .then((response)=>response.json())
        .then((data)=>fetchProducts());
    }

    return(
        <>
        <h2 className='text-center mb-3'>List of Products</h2>
        <button onClick={()=> props.showForm({})}type="button" className="btn btn-primary me-2">Create</button>
        <button onClick={()=> fetchProducts()}type="button" className="btn btn-outline-primary me-2">Refresh</button>
        <table className='table'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Created At</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    products.map((product,index)=>{
                        return(
                           <tr key={index}>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.brand}</td>
                            <td>{product.category}</td>
                            <td>{product.price}</td>
                            <td>{product.createdAt}</td>
                            <td style={{width:"10px",whiteSpace:"nowrap"}}>
                                <button onClick={()=>props.showForm(product)} type="button" className="btn btn-primary btn-sm me-2">Edit</button>
                                <button onClick={()=>deleteProduct(product.id)} type="button" className="btn btn-danger btn-sm">Delete</button>

                            </td>
                           </tr>
                        )
                    })
                }
            </tbody>
        </table>
        </>
    )
}
function ProductForm(props){
    const[errorMessage,setErrorMessage]=useState("")

    function handleSubmit(events){
        events.preventDefault();
        const formData=new FormData(events.target);

        const product=Object.fromEntries(formData.entries());
        if(!product.name || !product.brand|| !product.category|| !product.price){
            console.log("Please provide all the required fields");
            setErrorMessage(
                <div className="alert alert-warning" role="alert">
                     Please provide all the required details
</div>
            )
            return;
        }
        if(props.product.id){
            fetch("http://localhost:3000/products/"+props.product.id,{
                method:"PATCH",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify(product)
            })
            .then((response)=>{
                if(!response.ok){
                    throw new Error("Network response was not ok")
                }
                return response.json()
            })
            .then((data)=>props.showList())
            .catch((error)=>{
                console.error("Error :",error);
            });
        }
        else{

        
        //create a new product
        product.createdAt=new Date().toISOString().slice(0,10);
        fetch("http://localhost:3000/products",{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
            },
            body:JSON.stringify(product)
        })
        .then((response)=>{
            if(!response.ok){
                throw new Error("Network response was not ok")
            }
            return response.json()
        })
        .then((data)=>props.showList())
        .catch((error)=>{
            console.error("Error :",error);
        });
    }
}
    return(
        <>
        <h2 className="text-center mb-3">{props.product.id?"Edit Product":"Create new Product"}</h2>
        
        <div className="row">
            <div className='col-lg-6 mx-auto'>
                {errorMessage}
               <form onSubmit={(events)=>handleSubmit(events)}>
                {props.product.id && <div className='row mb-3'>
                    <label className='col-sm-4 col-form-label'>ID</label>
                    <div className='col-sm-8'>
                        <input readOnly className='form-control-plaintext' name='name' defaultValue={props.product.id}/>
                    </div>
                </div>}
                <div className='row mb-3'>
                    <label className='col-sm-4 col-form-label'>Name</label>
                    <div className='col-sm-8'>
                        <input className='form-control' name='name' defaultValue={props.product.name}/>
                    </div>
                </div>
                <div className='row mb-3'>
                    <label className='col-sm-4 col-form-label'>Brand</label>
                    <div className='col-sm-8'>
                        <input className='form-control' name='brand' defaultValue={props.product.brand}/>
                    </div>
                </div>
                <div className='row mb-3'>
                    <label className='col-sm-4 col-form-label'>Category</label>
                    <div className='col-sm-8'>
                        <select className='form-select' name='category' defaultValue={props.product.category}>
                            <option value="Phones">Phones</option>
                            <option value="Computers">Computers</option>
                            <option value="Accessories">Accessories</option>
                            <option value="GPS">GPS</option>
                            <option value="Cameras">Cameras</option>
                        </select>
                    </div>
                </div>
                <div className='row mb-3'>
                    <label className='col-sm-4 col-form-label'>Price</label>
                    <div className='col-sm-8'>
                        <input className='form-control' name='price' defaultValue={props.product.price}/>
                    </div>
                </div>
                <div className='row mb-3'>
                    <label className='col-sm-4 col-form-label'>Description</label>
                    <div className='col-sm-8'>
                        <textarea className='form-control' name='description' defaultValue={props.product.description}/>
                    </div>
                </div>
                <div className='row'>
                    
                    <div className='offset-sm-4 col-sm-4 d-grid'>
                        <button   type="submit" className='btn btn-primary btn-sm me-3'>Save</button>
                    </div>
                    <div className='col-sm-4 d-grid'>
                    <button onClick={()=>props.showList()} type="button" className="btn btn-secondary me-2">Cancel</button>
                    </div>
                </div>

               </form>
            </div>
        </div>
        </>
    )
}