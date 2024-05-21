"use client"
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./editmovie.css"

interface Movie {
    _id: string; // Thêm trường id vào interface Movie

    title: string;
    description: string;
    portraitImgUrl: string;
    portraitImg: File | null,
    landscapeImgUrl: string;
    landscapeImg: File | null;
    language: string;
    director: string;
    cast: string[]; // Kiểu dữ liệu của mảng cast là string[]
    releasedate: Date;
    rated: string;
    genre: string[]; // Kiểu dữ liệu của mảng genre là string[]
    duration: number;
}

const EditMoviePage = () => {

    const [movies, setMovies] = useState<Movie[]>([]); // Sử dụng kiểu dữ liệu Movie[]
    const [selectedMovieId, setSelectedMovieId] = useState<string>(""); // Lưu trữ id của phim được chọn

    const [selectedMovie, setSelectedMovie] = useState<Movie>({
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
        rated: '',
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
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setMovies(data.data);
                } else {
                    console.error("Failed to fetch movies");
                    toast.error("Failed to fetch movies", {
                        position: 'top-center',
                    });
                }
            } catch (error) {
                console.error("Error fetching movies", error);
            }
        };

        fetchMovies();
    }, []);

    // Hàm này sẽ được gọi mỗi khi selectedMovieId thay đổi
    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_API}/movie/movies/${selectedMovieId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        credentials: "include",
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setSelectedMovie(data.data); // Cập nhật selectedMovie với thông tin chi tiết của phim
                    console.log(selectedMovie)
                } else {
                    console.error("Failed to fetch movie details");
                    toast.error("Failed to fetch movie details", {
                        position: 'top-center',
                    });
                }
            } catch (error) {
                console.error("Error fetching movie details", error);
            }
        };

        if (selectedMovieId) {
            fetchMovieDetails();
        }
    }, [selectedMovieId]);

    const handleSelectMovie = (movieId: string) => {
        setSelectedMovieId(movieId); // Lưu id của phim được chọn
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const { name, value } = event.target;
        setSelectedMovie({ ...selectedMovie, [name]: value });
    };

    const uploadImage = async (image: File) => {
        try {
            const formData = new FormData();
            formData.append("myimage", image);
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/image/uploadimage`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Image uploaded successfully:", data);
                return data.imageUrl;
            } else {
                console.error("Failed to upload the image.");
                return null;
            }
        } catch (error) {
            console.error("Error:", error);
            return null;
        }
    };
    const handlePortraitImgChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];

        if (file) {
            setSelectedMovie({ ...selectedMovie, portraitImg: file });

            const imgUrl = await uploadImage(file);

            if (imgUrl) {
                setSelectedMovie({ ...selectedMovie, portraitImgUrl: imgUrl });
            }
        }
    };

    const handleLandscapeImgChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files && event.target.files[0];

        if (file) {
            setSelectedMovie({ ...selectedMovie, landscapeImg: file });

            const imgUrl = await uploadImage(file);

            if (imgUrl) {
                setSelectedMovie({ ...selectedMovie, landscapeImgUrl: imgUrl });
            }
        }
    };

    const handleUpdateMovie = async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/movie/updatemovie/${selectedMovie._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(selectedMovie),
                    credentials: "include",
                }
            );

            if (response.ok) {
                toast.success("Movie updated successfully", {
                    position: 'top-center',
                });
            } else {
                console.error("Failed to update movie");
                toast.error("Failed to update movie", {
                    position: 'top-center',
                });
            }
        } catch (error) {
            console.error("Error updating movie", error);
        }
    };



    return (
        <div className="edit-movie-page">
            
            <div className="fl-table">
            <br></br>
            <h2>Danh sách các phim:</h2>
            <br></br>
            <table id="customers">
            <thead>
            <tr>
               <th>Tên phim: </th>
               <th>Chỉnh sửa</th>
             </tr>
             </thead>
             <tbody>
            {movies.length > 0 && movies.map((movie) => (

                    <tr key={movie._id}>
                    <td>{movie.title}</td>
                    <td><button onClick={() => handleSelectMovie(movie._id)}>Chỉnh sửa</button></td>
                    </tr>
            ))}
            </tbody>
            </table>
            </div>

            {selectedMovie._id && (
                <section>
                <form>
                <div className="formpage">
                <div className = "hu">
                <div className = "hi">
                    {/* Hiển thị các trường thông tin của phim dựa trên selectedMovieId */}
                    <label>Tên</label>
                    <input
                        type="text"
                        name="title"
                        value={selectedMovie.title}
                        onChange={handleInputChange}
                    />
                    </div>
                    <div>
                    <label>Đạo diễn</label>
                    <input
                        type="text"
                        name="director"
                        value={selectedMovie.director}
                        onChange={handleInputChange}
                    />
                     </div>
                     </div>
                     <br />
                     <div className = "hu">
                    <div className = "hi">
                     <label>Ngôn ngữ</label>
                    <input
                        type="text"
                        name="language"
                        value={selectedMovie.language}
                        onChange={handleInputChange}
                    />
                    </div>
                     <div>
                    <label>Ngày chiếu</label>
                    <input
                        type="date"
                        name="releasedate"
                        value={selectedMovie.releasedate.toString().slice(0, 10)}
                        onChange={handleInputChange}
                    />
                     </div>
                    </div>
                     <br />
                     <div className = "ntd3">
                    <label>Mô tả</label>
                    <input
                        type="text"
                        name="description"
                        value={selectedMovie.description}
                        onChange={handleInputChange}
                    />
                     </div>
                     <br />
                     <div className = "ntd3">
                        <label>Ảnh đại diện</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePortraitImgChange}
                        />
                        {selectedMovie.portraitImgUrl && (
                            <img src={selectedMovie.portraitImgUrl} alt="Portrait" style={{ width: "200px", height: "200px" }} />
                        )}
                         </div>
                          <br />
                          <div className = "ntd3">
                        <label>Ảnh bìa</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLandscapeImgChange}
                        />
                        {selectedMovie.landscapeImgUrl && (
                            <img src={selectedMovie.landscapeImgUrl} alt="Landscape" style={{ width: "200px", height: "200px" }} />
                        )}
                         </div>
                         <br />
                         <div className = "ntd3">
                         <label>Rated</label>
                    <input
                        type="text"
                        name="rated"
                        value={selectedMovie.rated}
                        onChange={handleInputChange}
                    />
                     </div>
                     <br />
                     <div className = "ntd3">
                     <label>Thể loại</label>
                    <input
                        type="text"
                        name="genre"
                        value={selectedMovie.genre.join(',')}
                        onChange={handleInputChange}
                    />
                    </div>

                    <br />
            <div className = "ntd3">
                   <label>Thời lượng</label>
                    <input
                        type="numver"
                        name="duration"
                        value={selectedMovie.duration.toString()}
                        onChange={handleInputChange}
                    />
                     </div>
                     <br />

                     <div className = "ntd3">
                    <label>Diễn viên</label>
                    <input
                        type="text"
                        name="cast"
                        value={selectedMovie.cast.join(',')}
                        onChange={handleInputChange}
                    />
                    </div>
                    
                    
                    {/* Các trường thông tin khác của phim */}
                    <br></br><br></br>
                    <button onClick={handleUpdateMovie}>Lưu thay đổi</button>

                </div>

                
                </form>
                </section>

            )}
            <ToastContainer />
        </div>
    );
};

export default EditMoviePage;
