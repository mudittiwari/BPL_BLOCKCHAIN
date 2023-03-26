import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function AdminNavbar()
{
    const navigate = useNavigate();
    return (
        <>
            <div className="flex w-full items-center justify-center border" style={{ 'borderBottom': '1px solid black' }}>
                
                <ul className="flex py-4 px-0 w-max">
                    <li><Link className="no-underline text-black mx-2 font-semibold text-xs" to="/addproduct">Add Product</Link></li>
                    <li><Link className="no-underline text-black mx-2 font-semibold text-xs" to="/users">Users</Link></li>
                    <li><Link className="no-underline text-black mx-2 font-semibold text-xs" to="/products">Products</Link></li>
                    
                    <li><button className="no-underline text-black mx-2 font-semibold text-xs" onClick={(e)=>{
                        e.preventDefault();
                        navigate('/adminlogin');
                    }}>Logout</button></li>
                    
                </ul>
                {/* <Link to="/"><img src={logo} className="w-48 mx-auto relative right-6"></img></Link> */}
                
                

            </div>
        </>
    );
}

export default AdminNavbar;