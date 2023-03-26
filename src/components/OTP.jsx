import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Web3 from 'web3';
import Ecommerce from '../abis/Ecommerce.json';
import { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from "firebase/auth";
import app from '../Firebase';
import { connectStorageEmulator } from "firebase/storage";
function Otp() {
    const navigate = useNavigate();
    const [account, setaccount] = useState('')
  const [ecommerce, setecommerce] = useState('')
  const [user, setuser] = useState('')
    const location = useLocation();
    const [one, setcode1] = useState(1);
    const [two, setcode2] = useState(1);
    const [three, setcode3] = useState(1);
    const [four, setcode4] = useState(1);
    const [five, setcode5] = useState(1);
    const [six, setcode6] = useState(1);
    const auth = getAuth(app);
    const [result, setresult] = useState();
    async function loadWeb3() {
        if (window.ethereum) {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
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
        if (networkData) {
          const ecommerce_ = new web3.eth.Contract(Ecommerce.abi, networkData.address);
            const user=await ecommerce_.methods.users(location.state.phone).call();
            if(user.name.toString()!==''){
                setuser(user);
                verifyuser();
            }
            console.log(user);
          setecommerce(ecommerce_);
        } else {
          window.alert('Ecommerce contract not deployed to detected network.')
        }
      }
    const generaterecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
            'size': 'invisible',
            'callback': (response) => {
                // reCAPTCHA solved, allow signInWithPhoneNumber.
                // onSignInSubmit();
                console.log(response);
            }
        }, auth);
    }
    const verifyuser = async () => {
        generaterecaptcha();
        let appVerifier = window.recaptchaVerifier;
        signInWithPhoneNumber(auth, `+91${location.state.phone}`, appVerifier)
            .then((confirmationResult) => {
                // auth.setPersistence(auth.Persistence.LOCAL)
                console.log(confirmationResult);
                setresult(confirmationResult);
            }).catch((error) => {
                console.log(error);
                // Error; SMS not sent
                // ...
            });
    }
    const matchcode = async () => {
        let code = one + two + three + four + five + six;
        result.confirm(code).then((result) => {
            localStorage.setItem('bpluser', JSON.stringify(user));
            navigate('/')
        }).catch((error) => {
            console.log(error);
        });
    }
    useEffect(() => {
        loadWeb3();
        loadBlockchainData();
        
        
        // console.log(location.state.user)
    }, []);

    return (
        <>
        <div id="sign-in-button"></div>
            <div className="w-screen h-max py-8 flex items-center justify-center
            ">
                <div className="w-4/5 py-5 h-max bg-white flex flex-col items-center justify-center rounded-lg
            " style={{ 'border': '1px solid #ffd4bd' }}>
                    <h1 className="text-2xl font-medium mb-5" style={{ 'color': '#000000' }}>OTP is sent to {location.state.phone}</h1>
                   <div className='mt-10 flex'>
                        <div className='h-6 w-6 md:w-14 md:h-14 mx-4 related flex items-center border border-[#ffd4bd]'>
                            <input onChange={(e) => {
                                e.preventDefault();
                                setcode1(e.target.value);
                            }} type="text" className='outline-none w-full text-center h-full ' />
                        </div>
                        <div className='h-6 w-6 md:w-14 md:h-14 mx-4 related flex items-center border-[#ffd4bd]'>
                            <input onChange={(e) => {
                                e.preventDefault();
                                setcode2(e.target.value);
                            }} type="text" className='outline-none w-full text-center h-full ' />
                        </div>
                        <div className='h-6 w-6 md:w-14 md:h-14 mx-4 related flex items-center border-[#ffd4bd]'>
                            <input onChange={(e) => {
                                e.preventDefault();
                                setcode3(e.target.value);
                            }} type="text" className='outline-none w-full text-center h-full ' />
                        </div>
                        <div className='h-6 w-6 md:w-14 md:h-14 mx-4 related flex items-center border-[#ffd4bd]'>
                            <input onChange={(e) => {
                                e.preventDefault();
                                setcode4(e.target.value);
                            }} type="text" className='outline-none w-full text-center h-full ' />
                        </div>
                        <div className='h-6 w-6 md:w-14 md:h-14 mx-4 related flex items-center border-[#ffd4bd]'>
                            <input onChange={(e) => {
                                e.preventDefault();
                                setcode5(e.target.value);
                            }} type="text" className='outline-none w-full text-center h-full ' />
                        </div>
                        <div className='h-6 w-6 md:w-14 md:h-14 mx-4 related flex items-center border-[#ffd4bd]'>
                            <input onChange={(e) => {
                                e.preventDefault();
                                setcode6(e.target.value);
                            }} type="text" className='outline-none w-full text-center h-full ' />
                        </div>
                    </div>
                    <button onClick={(e)=>{
                        e.preventDefault();
                        // navigate('/');
                        matchcode()
                    }} className=" text-white mt-10 px-12 py-2 rounded-2xl focus:outline-none" style={{'backgroundColor':"#315ED2"}}>
      Submit
    </button>
                </div>
            </div>
        </>
    );
}
export default Otp;