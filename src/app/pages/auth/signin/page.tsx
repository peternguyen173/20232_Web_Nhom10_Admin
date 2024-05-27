'use client'
import React, { useState } from 'react';
import './auth.css';
import { ToastContainer, toast } from 'react-toastify';
import Image from 'next/image';
import logo from '../logo.png';
const SigninPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
  
    const handleSignin = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                // Handle successful signup, e.g., show a success message
                console.log('Admin login successful', data);

                toast.success('Admin Login Successful', {
                    // position: toast.POSITION.TOP_CENTER,
                });
                window.location.href = '/'; // Điều hướng đến trang chủ


            } else {
                // Handle signup error
                console.error('Admin login failed', response.statusText);
                toast.error('Admin Login Failed', {
                    // position: toast.POSITION.TOP_CENTER,
                });
            }
        }

        catch (error) {
            toast.error('An error occured while signing in');
            console.error('An error occured while signing in', error);

        }
    }



    return (
        <div className='authout'>
            <div className='authin'>
                <div className="left">
                    <Image src={logo} alt="" className='img' />
                </div>
                <div className='right'>
                    <form
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <div className="forminput_cont">
                            <div><label>Tên đăng nhập</label></div> 
                            <div> <input
                                type='email'
                                placeholder='Email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            </div>
                        </div>
                        <div className="forminput_cont">
                            <div><label>Mật khẩu</label></div> 
                            <div> 
                                <input
                                    type='password'
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div> 
                        </div>

                        <button type="submit" className="main_button" onClick={handleSignin}>
                            ĐĂNG NHẬP
                        </button>
                        {/* <button type="submit" className="main_button"  onClick={handleSignin}>
                          <span>  ĐĂNG NHẬP VỚI GOOGLE </span>
                        </button> */}

                    </form>
                   
                </div>
            </div>
        </div>
        // <div className='formpage'>
        //     <div className='tdn'>
        //         <label>Tên đăng nhập</label>
        //         <input
        //             type='email'
        //             placeholder='Email'
        //             value={email}
        //             onChange={(e) => setEmail(e.target.value)}
        //         />
        //     </div>
        //     <div>
        //         <label>Mật khẩu</label>
        //         <input
        //             type='password'
        //             placeholder='Password'
        //             value={password}
        //             onChange={(e) => setPassword(e.target.value)}
        //         />
        //     </div>

        //     <button onClick={handleSignin}>Sign in</button>
        // </div>
    )
}

export default SigninPage