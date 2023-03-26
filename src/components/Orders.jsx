import { GrClose } from "react-icons/gr";
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useState } from "react";
import Login from "./Login";
import { toast, ToastContainer } from "react-toastify";
import Web3 from 'web3';
import Ecommerce from '../abis/Ecommerce.json';
import { async } from "@firebase/util";
function Orders({ open, setOpen }) {
  const [products, setproducts] = useState([]);
  const [account, setaccount] = useState('')
  const [subtotal, setsubtotal] = useState(0);
  const [ecommerce, setecommerce] = useState('')
  const [user, setuser] = useState(JSON.parse(localStorage.getItem("bpluser")));
  
  const notify = () => toast.success("Product removed from cart", {
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    // toastId: "007",
  });;
 
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
      const cart = await ecommerce_.methods.getcartitems(user.phone_number).call();
      let arr = [];
      let sum = 0;
      for (let index = 0; index < cart.length; index++) {
        const element = cart[index];
        let prod = await ecommerce_.methods.products(element).call();
        arr.push(prod);
        sum += parseInt(prod.price);
      }
      setproducts(arr);
      setsubtotal(sum);
      setecommerce(ecommerce_);
      // changeusercounter(usercounter_);

    } else {
      window.alert('Ecommerce contract not deployed to detected network.')
    }
  }
  useEffect(() => {
    loadWeb3();
    loadBlockchainData();
  }, [open]);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-[#ffd4bd] shadow-xl">
                    <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">Orders</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <ToastContainer />
                          <button
                            type="button"
                            className="-m-2 p-2 text-gray-400 hover:text-gray-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <GrClose className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-8">
                        <div className="flow-root">
                          <ul role="list" className="-my-6 divide-y divide-gray-200">
                            {products.map((product, index) => {
                              console.log(product);
                              return <li key={index} className="flex py-6">
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                  <img
                                    src={product.image}

                                    className="h-full w-full object-cover object-center"
                                  />
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                  <div>
                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                      <h3>
                                        <a>{product.title}</a>
                                      </h3>
                                      <p className="ml-4">₹{product.price}</p>
                                    </div>
                                    {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                                  </div>
                                  <div className="flex flex-1 items-end justify-between text-sm">
                                    <p className="text-gray-500">Qty {product.quantity}</p>

                                    <div className="flex">
                                      <button
                                        onClick={() => {
                                        //   removeProduct(product.id);
                                        }}
                                        type="button"
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                      >
                                        Remove
                                      </button>
                                    </div>

                                  </div>
                                </div>
                              </li>
                            })}

                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Subtotal</p>
                        <p>₹{subtotal}</p>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">Shipping will be done after confirmation of order.</p>
                      <div className="mt-6">
                        <a
                          onClick={async (e) => {

                            e.preventDefault();
                            var today = new Date();
                            var dd = String(today.getDate()).padStart(2, '0');
                            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                            var yyyy = today.getFullYear();

                            today = mm + '/' + dd + '/' + yyyy;
                            await ecommerce.methods.createorder(user.name, user.phone_number, products[0].title, products[0].quantity, today,subtotal).send({ from: account }).on('receipt', function (receipt) {
                              console.log("order created");
                            });
                          }}

                          className="cursor-pointer flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                        >
                          Checkout
                        </a>
                      </div>
                      <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                        <p>
                          or
                          <button
                            type="button"
                            className="font-medium text-indigo-600 hover:text-indigo-500 pl-1"
                            onClick={() => setOpen(false)}
                          >
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
        {/* <Login open={openLogin} setOpen={setOpenLogin} /> */}
      </Dialog>

    </Transition.Root>
  );
}

export default Orders;