//import React, { useState, useEffect } from 'react';
import './Home.css';

const Home = () => {
    //update the array to include all your images
    const images = [
        'img1.jpg', 'img2.jpg', 'img3.jpg', 'img5.jpg',
        'img6.jpg', 'img7.jpg', 'img8.jpg', 'img9.jpg', 'img10.jpg',
        'jose-interview.jpg', 'omar-sam-celebration.jpg', 'sam-interview.jpg'
        //temporary, will change this later
    ];

    return (
        <div className="home">
            <div className="hero-header">
                <h1>UH Men's Soccer</h1>
                <p>Home of the Coogs</p>
            </div>
            <div className="hero-carousel">
                <div id="imageCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {images.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#imageCarousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? "active" : ""}
                                aria-current={index === 0 ? "true" : "false"}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>
                    
                    <div className="carousel-inner">
                        {images.map((image, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                <img 
                                    src={`/images/${image}`} 
                                    className="d-block w-100" 
                                    alt={`Slide ${index + 1}`}
                                />
                            </div>
                        ))}
                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home; 