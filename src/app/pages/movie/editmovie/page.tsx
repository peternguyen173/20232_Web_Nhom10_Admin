"use client"
import React, {useState,useEffect} from "react";
import { ToastContainer, toast } from "react-toastify";

interface Movie {
    _id: string; //Thêm trường id vào interface Movie

    title: string;
    description: string;
    portraitImgUrl: string;
    portraitImg: File | null;
    landscapeImgUrl: string;
    landscapeImg: File | null;
    language: string;
    director: string;
    cast: string[]; //Kiểu dữ liệu của mảng cast là string;
    releasedate: Date;
    rating: string;
    genre: string [];
    duration: number;
}

const EditMoviePage = () => {
    const [movies,setMovies] = useState<Movie[]>([]); //Sử dụng kiểu dữ liệu Movie[]
    const [selectedMovieId,setSelectedMovieId] = useState<string>(""); //Lưu trữ id của phim được chọn

    const [selectedMovie,setSelectedMovie] = useState<Movie>({
        _id: "",
        title: '',
        description: '',
        portraitImgUrl: '',
        portraitImg: null,
        landscapeImgUrl: '',
        landscapeImg: null,
        language: '',
        director: '',
        cast: [],
        releasedate: new Date(),
        rating: '',
        genre: [],
        duration: 0,
    });
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application\json",
                        },
                        credentials: "include",
                    }
                );

                if(response.ok) {
                    const data = await response.json();
                    console.log(data);
                    setMovies(data.data);
                } else {
                    console.error("Failed to fetch movies");
                    toast.error("Failed to fetch movies", {
                        position: 'top-center',
                    });
                }
            } catch(error) {
                console.log("Error fetching movies", error);
            }
        };

        fetchMovies();
    }, []);
}