'use client'
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import './movie.css';

interface Movie {
    title: string;
    description: string;
    portraitImgUrl: string;
    portraitImg: File | null;
    landscapeImgUrl: string;
    landscapeImg: File | null;
    language: string;
    director: string;
    cast: string[];
    releasedate: Date;
    rated: string;
    genre: string[];
    duration: number;
}

const CreateMoviePage = () => {
    const [movie, setMovie] = useState<Movie>({
        title: "",
        description: "",
        portraitImgUrl: "",
        portraitImg: null,
        landscapeImgUrl: "",
        landscapeImg: null,
        language: "",
        director: "",
        cast: [],
        rated: "",
        releasedate: new Date(),
        genre: [],
        duration: 0,
    });

    const genres = [
        "Hành động",
        "Hài kịch",
        "Chính kịch",
        "Kỳ ảo",
        "Kinh dị",
        "Khoa học viễn tưởng",
        "Giật gân",
        "Âm nhạc",
    ];

    const handleGenreChange = (genre: string) => {
        if (movie.genre.includes(genre)) {
            setMovie({
                ...movie,
                genre: movie.genre.filter((selectedGenre) => selectedGenre !== genre),
            });
        } else {
            setMovie({ ...movie, genre: [...movie.genre, genre] });
        }
    };

    const [actorName, setActorName] = useState<string>(""); // State to store the new actor name
    const [releaseDate, setReleaseDate] = useState<string>(""); // State for release date

    const handleCastChange = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Prevent form submission
        if (actorName.trim()) {
            const updatedCast = [...movie.cast, actorName]; // Add new actor name to the cast list
            setMovie({ ...movie, cast: updatedCast });
            setActorName(""); // Reset the actor name input
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setMovie({ ...movie, [name]: value });
    };

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setReleaseDate(value);
        setMovie({ ...movie, releasedate: new Date(value) });
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

    const handleCreateMovie = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent form submission
        try {
            if (
                movie.title === "" ||
                movie.description === "" ||
                movie.genre.length === 0 ||
                movie.duration === 0 ||
                movie.language === ""
            ) {
                toast.error("Please fill all the fields", {
                    position: toast.POSITION.TOP_CENTER,
                });
                return;
            }

            let portraitImgUrl = movie.portraitImgUrl;
            let landscapeImgUrl = movie.landscapeImgUrl;

            if (movie.portraitImg) {
                portraitImgUrl = await uploadImage(movie.portraitImg);
                if (!portraitImgUrl) {
                    toast.error("Portrait Image upload failed", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    return;
                }
            }
            if (movie.landscapeImg) {
                landscapeImgUrl = await uploadImage(movie.landscapeImg);
                if (!landscapeImgUrl) {
                    toast.error("Landscape Image upload failed", {
                        position: toast.POSITION.TOP_CENTER,
                    });
                    return;
                }
            }

            const newMovie = { ...movie, portraitImgUrl, landscapeImgUrl };

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/movie/createmovie`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newMovie),
                    credentials: "include",
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log("Movie creation successful", data);

                toast.success("Movie Created Successfully", {
                    position: toast.POSITION.TOP_CENTER,
                });
            } else {
                console.error("Movie creation failed", response.statusText);

                toast.error("Hãy điền đầy đủ các trường thông tin", {
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("An error occurred during movie creation", error);
        }
    };

    return (
        <section>
            <form onSubmit={handleCreateMovie}>
                <div className="formpage">
                    <div className="hu">
                        <div className="hi">
                            <label>Tên phim: </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Tên phim"
                                value={movie.title}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Đạo diễn: </label>
                            <input
                                type="text"
                                placeholder="Đạo diễn"
                                name="director"
                                value={movie.director}
                                onChange={handleInputChange} // Using handleInputChange for director field
                            />
                        </div>
                    </div>
                    <br />
                    <div className="hu">
                        <div className="hi">
                            <label>Ngôn ngữ: </label>
                            <input
                                type="text"
                                placeholder="Ngôn ngữ"
                                name="language"
                                value={movie.language}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div>
                            <label>Ngày ra mắt: </label>
                            <input
                                type="date"
                                placeholder="Ngày ra mắt:"
                                name="releasedate"
                                value={releaseDate}
                                onChange={handleDateChange}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="ntd3">
                        <label>Nội dung: </label>
                        <input
                            className="outform"
                            type="text"
                            name="description"
                            placeholder="Nội dung phim"
                            value={movie.description}
                            onChange={handleInputChange}
                        />
                    </div>
                    <br />
                    <div className="ntd3">
                        <label>Ảnh đại diện: </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                if (event.target.files && event.target.files.length > 0) {
                                    setMovie({ ...movie, portraitImg: event.target.files[0] });
                                }
                            }}
                        />
                    </div>
                    <br />
                    <div className="ntd3">
                        <label>Ảnh bìa: </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => {
                                if (event.target.files && event.target.files.length > 0) {
                                    setMovie({ ...movie, landscapeImg: event.target.files[0] });
                                }
                            }}
                        />
                    </div>
                    <br />
                    <div className="ntd3">
                        <label>Đánh giá: </label>
                        <input
                            type="text"
                            name="rated"
                            placeholder="Đánh giá"
                            value={movie.rated}
                            onChange={handleInputChange}
                        />
                    </div>
                    <br />
                    <p>Chọn thể loại:</p>
                    <br />
                    <div className="f">
                        {genres.map((genre) => (
                            <label className="hh" key={genre}>
                                <input
                                    type="checkbox"
                                    name="genre"
                                    checked={movie.genre.includes(genre)}
                                    onChange={() => handleGenreChange(genre)}
                                />
                                {genre}
                            </label>
                        ))}
                    </div>
                    <br />
                    <div className="ntd3">
                        <label>Thời lượng: </label>
                        <input
                            type="number"
                            name="duration"
                            placeholder="Thời lượng"
                            value={movie.duration}
                            onChange={handleInputChange}
                        />
                    </div>
                    <br />
                    <div className="ntd3">
                        <label>Tên diễn viên: </label>
                        <input
                            type="text"
                            placeholder="Tên diễn viên"
                            onChange={(e) => setActorName(e.target.value)}
                            value={actorName}
                        />
                        <button onClick={handleCastChange}>Thêm diễn viên</button>
                    </div>
                    <div>
                        <p>{movie.cast.join(", ")}</p>
                    </div>
                    <button type="submit">Thêm phim</button>
                </div>
            </form>
            <ToastContainer />
        </section>
    );
};

export default CreateMoviePage;
