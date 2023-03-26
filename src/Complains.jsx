import React, { useEffect, useState, useRef } from 'react';
import { getStorage,ref,getDownloadURL, uploadBytesResumable  } from "firebase/storage";
import { getFirestore,collection,addDoc } from "firebase/firestore";
import {  query, where, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';
import app from './Firebase';
function Complains() {
    const db = getFirestore(app);
    // console.log(props.products);
    const ref = useRef(null);
    const navigate=useNavigate();
    const [complainsarray, changecomplainsarray] = useState([]);
    async function getcomplains() {
        const q = query(collection(db, "complaints"));
        const querySnapshot = await getDocs(q);
        let complains = [];
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            complains.push(doc.data());
            // changeblogarray([...blogarray,doc.data()]);
        });
        changecomplainsarray(complains);
    }
    useEffect(()=>{
        // console.log(localStorage.getItem('user'));
        if(localStorage.getItem('user')){
        if(JSON.parse(localStorage.getItem('user'))["isAdmin"]==true){
            getcomplains();
    }
    else
    {
        navigate('/login');
    }
    }
    else
    {
        navigate('/login');
    }
    },[])
    // console.log(elements);
    return (
        <div>
            <ul>
                
                {complainsarray.map((value, index) => {
                    // console.log(index);\
                    return <div className=" bg-white h-max px-5 my-8 rounded-md py-5 mx-auto flex w-3/4 related">
                        <div className=" flex justify-center align-center flex-col w-3/4">
                            <li className="text-black">
                                <div className="flex">
                                    <h1 className="mx-3">Name:</h1>
                                    <h1>{value.name}</h1>
                                </div>
                                <div className="flex">
                                    <h1 className="mx-3">Phone:</h1>
                                    <h1>{value.phone}</h1>
                                </div>
                                <div className="flex">
                                    <h1 className="mx-3">Address:</h1>
                                    <h1>{value.address}</h1>
                                </div>
                                <div className="flex">
                                    <h1 className="mx-3">Title:</h1>
                                    <h1>{value.title}</h1>
                                </div>
                                <div className="flex">
                                    <h1 className="mx-3">Description:</h1>
                                    <h1>{value.description}</h1>
                                </div>
                               
                                <div className="flex">
                                <h1 className="mx-3">File:</h1>
                                    <a className='underline' href={value.imageurl} download><h1 className="mx-3">Download</h1></a>
                                    <a className='underline' href={value.imageurl}><h1 className="mx-3">View</h1></a>
                                </div>
                            </li>
                        </div>
                        
                    </div>
                })}
            </ul>
        </div>
    );
}

export default Complains;