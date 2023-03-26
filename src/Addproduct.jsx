import React, { useEffect, useRef } from "react";
import { getStorage,ref,getDownloadURL, uploadBytesResumable  } from "firebase/storage";
import { getFirestore,collection,addDoc,deleteDoc } from "firebase/firestore";
import Ecommerce from './abis/Ecommerce.json';
import Web3 from 'web3';
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import app from './Firebase';
function Addproduct() {
    
    const navigate = useNavigate();
    const storage = getStorage(app);
    const db = getFirestore(app);
    // const ref = useRef(null);
    // const [desc,changedesc]=useState("");
    const [submit_status,changesubstatus]=useState(false);
    const [upload_status,changeupstatus]=useState(false);
    const [imagearray, changeimagearray] = useState([]);
    const [price,changeprice]=useState("");
    const [quantity,changequantity]=useState("");
    const [image, setImage] = useState('');
    const [title, changetitle] = useState('');
   
    const [desc, changedesc] = useState('');
   
    const upload = async () => {
        // e.preventDefault();
        // console.log(image);
        if (image == null)
            return;
        // changeupstatus(true);
        // changesubstatus(true);
        
        // ref.current.continuousStart(0);
        const storageRef = ref(storage, `files/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on('state_changed',
            (snapShot) => {
                //takes a snap shot of the process as it is happening
                console.log(snapShot);
            }, (err) => {
                //catches the errors
                console.log(err);
                // ref.current.complete();
                // changeupstatus(false);
                // changesubstatus(false);
            }, () => {
                // gets the functions from storage refences the image storage in firebase by the children
                // gets the download url then sets the image from firebase as the value for the imgUrl key:
                // console.log(submit_status, upload_status);
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // console.log(downloadURL);
                    changeimagearray([...imagearray,downloadURL]);
                  });
                // ref.current.complete();
                // changeupstatus(false);
                // changesubstatus(false);
            });
            
            // console.log(submit_status,upload_status);
            // changeupstatus(false);

    }
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

  async function loadBlockchainData() {
    const web3 = new Web3(window.ethereum);

    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setaccount(accounts[0])
    const networkId = await web3.eth.net.getId()
    const networkData = Ecommerce.networks[networkId]
    if(networkData) {
      const ecommerce_=new web3.eth.Contract(Ecommerce.abi, networkData.address);
      const usercounter_=await ecommerce_.methods.usercounter().call();
      console.log(usercounter_);
      setecommerce(ecommerce_);
      // changeusercounter(usercounter_);

    } else {
      window.alert('Ecommerce contract not deployed to detected network.')
    }
  }
  useEffect(()=>{
    loadWeb3();
    loadBlockchainData();
  },[])
    return (
        <>
            {/* <LoadingBar style={{ 'backgroundColor': 'red', 'zIndex': 10 }} ref={ref} /> */}
            <div className="w-3/4 mx-auto my-5">
                <h1 className="text-black text-xl font-bold my-10 mx-auto w-1/2 text-center">Add Product</h1>
                <div className="relative z-0 w-full mb-6 group">
                    <input type="text" onChange={(e) => {
                        changetitle(e.target.value);
                    }} value={title} name="title" className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600  focus:outline-none focus:border-gray-300 focus:ring-0 peer" placeholder=" " required="" />
                    <label for="title" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">product Title</label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                    <input type="number" onChange={(e) => {
                        changeprice(e.target.value);
                    }} value={price} name="price" className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600  focus:outline-none focus:border-gray-300 focus:ring-0 peer" placeholder=" " required="" />
                    <label for="price" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">product price</label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                    <input type="text" onChange={(e) => {
                        changequantity(e.target.value);
                    }} value={quantity} name="quantity" className="block py-2.5 px-0 w-full text-sm text-black  bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600  focus:outline-none focus:border-gray-300 focus:ring-0 peer" placeholder=" " required="" />
                    <label for="quantity" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">product quantity</label>
                </div>
                <div className="relative z-0 w-full mb-6 group">
                    <input type="text" onChange={(e) => {
                        changedesc(e.target.value);
                    }} value={desc} name="desc" className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600  focus:outline-none focus:border-gray-300 focus:ring-0 peer" placeholder=" " required="" />
                    <label for="desc" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0   peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description</label>
                </div>
                
                <div className="flex flex-col w-full justify-center items-center">
                    <div className="mb-10">
                        <input type="file" onChange={(e) => { setImage(e.target.files[0]) }} />
                        <button className="bg-white text-black w-24 rounded-lg border-0 px-3 py-2 my-2 mx-8" style={{'border':'1px solid black'}} disabled={upload_status} onClick={async (e) =>{
                            e.preventDefault();
                            upload();
                            
                            // e.preventDefault();
                        }}>Upload</button>
                    </div>
                    <button type="button" className="bg-white text-black w-24 rounded-lg border-0 px-3 py-2 my-2 mx-8" style={{'border':'1px solid black'}} disabled={submit_status} onClick={async (e) => {
                        console.log(account);
                        try {
                            await ecommerce.methods.createproduct(title,price,desc,quantity,imagearray[0]).send({from:account}).on('receipt', function(receipt){
                                alert("Product has been added in the blockchain")
                            });
                        } catch (error) {
                            console.log(error);
                        }
                        
                        console.log("done");
                    }}>Submit</button>
                </div>
            </div>
        </>
    );
}


export default Addproduct;