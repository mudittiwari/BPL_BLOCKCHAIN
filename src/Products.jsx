import React, { useEffect, useState, useRef } from 'react';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getFirestore, collection, addDoc,deleteDoc, doc } from "firebase/firestore";
import { query, where, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import Ecommerce from './abis/Ecommerce.json';
import Web3 from 'web3';
import app from './Firebase';


function Products() {

    const db = getFirestore(app);
    // console.log(props.products);
    const ref = useRef(null);
    const navigate = useNavigate();
    const [productsarray, changeproductsarray] = useState([]);
    const [account,setaccount]=useState('')
    const [ecommerce,setecommerce]=useState('')
    const [usercounter,changeusercounter]=useState(null)
    async function loadWeb3() {
      if (window.ethereum) {
          await window.ethereum.request({method: 'eth_requestAccounts'});   
      }
      
      else {
        window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      }
    }
  
    async function loadallproducts() {
      const web3 = new Web3(window.ethereum);
  
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setaccount(accounts[0])
      const networkId = await web3.eth.net.getId()
      const networkData = Ecommerce.networks[networkId]
      if(networkData) {
        const ecommerce_=new web3.eth.Contract(Ecommerce.abi, networkData.address);
        const usercounter_=await ecommerce_.methods.usercounter().call();
        try {
            let prods=await ecommerce_.methods.getallproudcts().call();
            console.log(prods)
            changeproductsarray(prods);
        } catch (error) {
            console.log(error);
        }
        console.log(usercounter_);
        setecommerce(ecommerce_);
        // changeusercounter(usercounter_);
  
      } else {
        window.alert('Ecommerce contract not deployed to detected network.')
      }
    }

    useEffect(() => {
        // console.log(localStorage.getItem('user'));
        
        if (localStorage.getItem('user')) {
            if (JSON.parse(localStorage.getItem('user'))["isAdmin"] == true) {
                loadWeb3();
                loadallproducts();
            }
            else {
                navigate('/login');
            }
        }
        else {
            navigate('/login');
        }
    }, [])
    // console.log(elements);
    return (
        <div>
            <h1 className="text-black text-xl font-bold my-10 mx-auto w-1/2 text-center">products</h1>
            <ul>

                {productsarray.map((value, index) => {
                    // console.log(index);\
                    if(value[1]=="")
                        return <h1></h1>
                    return <div className=" bg-white h-max px-5 my-8 rounded-md py-5 mx-auto flex w-3/4 related">

                        <div className=" flex justify-center align-center flex-col w-full">
                            <li className="text-black">
                                <div className="flex">
                                    <h1 className="mx-3">Title:</h1>
                                    <h1>{value[1]}</h1>
                                </div>
                                <div className="flex">
                                    <h1 className="mx-3">Price:</h1>
                                    <h1>{value[2]}</h1>
                                </div>
                                <div className="flex">
                                    <h1 className="mx-3">Quantity:</h1>
                                    <h1>{value[4]}</h1>
                                </div>
                                <div className="flex">
                                    <h1 className="mx-3">Desc:</h1>
                                    <h1>{value[3]}</h1>
                                </div>
                                <div className="flex">
                                    <h1 className="mx-3">Image:</h1>
                                    <h1>{value[5]}</h1>
                                </div>

                                <div className="flex w-full justify-center">
                                    <button className="bg-white text-black w-24 rounded-lg border-0 px-3 py-2 my-2 mx-8" style={{'border':'1px solid black'}}  onClick={async (e) => {
                                        e.preventDefault();
                                        try {
                                            await ecommerce.methods.deleteproduct(value[0]).send({from:account}).on('receipt', function(receipt){
                                                alert("Product has been deleted from the blockchain");
                                                loadallproducts();
                                            });
                                        } catch (error) {
                                            console.log(error);
                                        }
                                    }}>Delete</button>
                                    <button className="bg-white text-black w-24 rounded-lg border-0 px-3 py-2 my-2 mx-8" style={{'border':'1px solid black'}} onClick={async (e) => {
                                        e.preventDefault();
                                        navigate('/editproduct',{state:{'id':value[0],'title':value[1],'price':value[2],'quantity':value[4],'desc':value[3]}})
                                        // e.preventDefault();
                                    }}>Edit</button>
                                </div>
                            </li>
                        </div>

                    </div>
                })}
            </ul>
        </div>
    );
}
export default Products;