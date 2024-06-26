"use client"
import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './promotion.css';


interface Promotion {
    title: string;
    type: string;
    description: string;
    discount: number;
    startDate: string;
    expiryDate: string;
}

const CreatePromotionPage: React.FC = () => {
    const [promotion, setPromotion] = useState<Promotion>({
        title: '',
        type: '',
        description: '',
        discount: 0,
        startDate: '',
        expiryDate: '',
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPromotion({ ...promotion, [name]: value });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        console.log(promotion);
        e.preventDefault();
        try {
            if (
                promotion.title === '' ||
                promotion.description === '' ||
                promotion.discount <= 0 ||
                promotion.expiryDate === '' ||
                promotion.startDate === '' ||
                promotion.type === ''
            ) {
                toast.error('Please fill all the fields', {
                    position: 'top-center',
                });
                return;
            }

            const startDate1 = new Date(promotion.startDate);
            const expiryDate1 = new Date(promotion.expiryDate);

            if (expiryDate1 <= startDate1) {
                toast.error('Ngày hết hạn khuyến mãi phải lớn hơn ngày bắt đầu', {
                    position: 'top-center',
                });
                return;
            }

            // Gửi dữ liệu khuyến mãi đến backend để tạo khuyến mãi
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/movie/createpromotion`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(promotion),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Promotion created successfully', data);

                toast.success('Promotion Created Successfully', {
                    position: 'top-center',
                });
            } else {
                console.error('Promotion creation failed', response.statusText);
                toast.error('Promotion Creation Failed', {
                    position: 'top-center',
                });
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <div className="formpage">
            <section>
            <form onSubmit={handleSubmit}>
            <h1>Tạo khuyến mãi</h1>
            <br />
            <br />
            <div className = "ntd3">
                    <label>Tên khuyến mãi: </label>
                    <input
                         className = "outform"
                        type="text"
                        name="title"
                        placeholder="Tên khuyến mãi"
                        value={promotion.title}
                        onChange={handleInputChange}
                    />
                </div>
                <br />
                <div className = "ntd3">
                    <label>Mô tả: </label>
                    <input
                        className = "outform"
                        type="text"
                        name="description"
                        placeholder="Mô tả"
                        value={promotion.description}
                        onChange={handleInputChange}
                    />
                </div>
                <br />
                <div>
                    <div className = "f">
                    <label>Loại: </label>
                <br />
                <br />
                    <label className = "hh">
                        <input
                            type="radio"
                            name="type"
                            value="percentage"
                            checked={promotion.type === 'percentage'}
                            onChange={handleInputChange}
                        />
                        Phần trăm
                    </label>
                    <label className = "hh">
                        <input
                            type="radio"
                            name="type"
                            value="fixed"
                            checked={promotion.type === 'fixed'}
                            onChange={handleInputChange}
                        />
                        Cố định
                    </label>
                    </div>
                </div>
                

                <div  className = "ntd3">
                    <label>Lượng discount: </label>
                    <input
                        type="number"
                        name="discount"
                        placeholder="Discount (%)"
                        value={promotion.discount}
                        onChange={handleInputChange}
                    /></div>
                <br />
                <div className = "ntd3">
                    <p>Ngày bắt đầu - kết thúc: </p>
                    <br></br>
                    <input
                        type="date"
                        name="startDate"
                        placeholder="Expiry Date"
                        value={promotion.startDate}
                        onChange={handleInputChange}
                    /> - 
                    <input
                        type="date"
                        name="expiryDate"
                        placeholder="Expiry Date"
                        value={promotion.expiryDate}
                        onChange={handleInputChange}
                    />
                </div>

                <br />
                <button type="submit">Tạo khuyến mãi</button>
            </form>
            </section>
            <ToastContainer />
        </div>
    );
};

export default CreatePromotionPage;