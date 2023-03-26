import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Ecommerce from '../abis/Ecommerce.json';
import { useState } from "react";
import { useEffect } from "react";
import Login from "./Login";
import Web3 from 'web3';
// import { products } from "../Constants";
export const Homepagecompfive = () => {
  const [products, setproducts] = useState([]);
  const [openLogin, setOpenLogin] = useState(false);
  const [account, setaccount] = useState('')
  const [ecommerce, setecommerce] = useState('')
  const [user,setuser]=useState(JSON.parse(localStorage.getItem("bpluser")));
  const notify = () =>
    toast.success(`product is added to your cart successfully`, {
      position: toast.POSITION.TOP_LEFT,
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      // toastId: "001",
    });
  const addtocart = async(id) => {
    
    try {
      await ecommerce.methods.addtocart(id,user.phone_number).send({ from: account }).on('receipt', function (receipt) {
        notify();
      });
    } catch (error) {
      console.log(error);
    }
  };
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
      const prods = await ecommerce_.methods.getallproudcts().call();
      console.log(prods);
      setecommerce(ecommerce_);
      setproducts(prods);
      // changeusercounter(usercounter_);

    } else {
      window.alert('Ecommerce contract not deployed to detected network.')
    }
  }
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, [])
  return (
    <div
      className="h-max w-screen lg:p-8 xl:p-8 2xl:p-8 p-4"
      style={{ backgroundColor: "#e48c71" }}
      data-aos="fade-up"
    >
      <ToastContainer />
      {products.map((product, index) => {
        if (index == 0)
          return <h1></h1>
        return <div className="bg-primary" key={index}>
          <div className="p-8 bg-white flex lg:flex-row xl:flex-row 2xl:flex-row flex-wrap justify-around">
            <div className="lg:w-5/12 xl:w-5/12 2xl:w-5/12 w-full grid">
              <h1 className=" bg-white font-semibold text-2xl text-black">
                {product.title}
              </h1>
              <div className="flex mt-2 justify-between items-center">
                <h1 className=" bg-white font-normal text-lg text-black">
                  {product.desc}
                </h1>
                <a

                  onClick={(e) => {
                    e.preventDefault();
                    if (localStorage.getItem('bpluser') == null) {
                      setOpenLogin(true);
                    }

                    else {
                      addtocart(product.id);
                      // addtocart(product.id);
                      
                    }
                  }}
                  className="mx-1 text-left bg-primary-500 px-1 py-1 border-black border-2 flex items-center justify-center font-bold rounded w-44 text-black h-max hover:cursor-pointer lg:w-32 xl:w-32 2xl:w-32 bg-[#f1d4ca]  hover:scale-105 hover:bg-white"
                >
                  ₹{product.price}
                </a>
              </div>
              <div className="bg-black h-0.5 my-5 mx-auto w-full">
                <div className="p-2"></div>
              </div>
            </div>
          </div>
        </div>
      }
      )}
      <Login open={openLogin} setOpen={setOpenLogin} />
    </div >

  );
};

export default Homepagecompfive;
