'use client'
import React, { useState } from 'react';
import './auth.css';
import logo from '../logo.png';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async () => {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_API + '/admin/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                // Handle successful signup, e.g., show a success message
                console.log('Admin registration successful', data);

                toast.success('Admin Registration Successful', {
                    position: toast.POSITION.TOP_CENTER,
                });
            } else {
                // Handle signup error
                console.error('Admin registration failed', response.statusText);
                toast.error('Admin Registration Failed', {
                    position: toast.POSITION.TOP_CENTER,
                });
            }
        }

        catch (error) {
            toast.error('An error occured while signing up');
            console.error('An error occured while signing up', error);

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
                        <div>
                            <input
                                type='text'
                                placeholder='Tên đăng nhập'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="forminput_cont">
                        <div><label>Email</label></div> 
                        <div> 
                             <input
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
                    <button type="submit" className="main_button"  onClick={handleSignup}>
                      <span>  ĐĂNG KÍ </span>
                    </button>

                </form>
               
            </div>
        </div>
    </div>
    )
}

export default SignupPage