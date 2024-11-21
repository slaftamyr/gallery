import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState("");
  const [filteredImages, setFilteredImages] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [typingText, setTypingText] = useState("");
  const [fullText] = useState(
    "enjoy beautiful, diverse images in our gallery!"
  );

  // Fetch images function
  const fetchImages = async (newPage = 1) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://picsum.photos/v2/list?page=${newPage}&limit=30`
      );
      setImages((prevImages) => [...prevImages, ...response.data]);
      setFilteredImages((prevImages) => [...prevImages, ...response.data]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      setIsLoading(false);
    }
  };

  // Typing text effect
  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      setTypingText((prev) => prev + fullText[index]);
      index += 1;
      if (index === fullText.length) clearInterval(typingInterval);
    }, 100);
  }, [fullText]);

  // Handle search
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setQuery(searchTerm);
    if (searchTerm.trim()) {
      const filtered = images.filter((image) =>
        image.author.toLowerCase().includes(searchTerm)
      );
      setFilteredImages(filtered);
    } else {
      setFilteredImages(images);
    }
  };

  // Image click handler for modal
  const handleImageClick = (image) => {
    setCurrentImage(image);
  };

  // Close modal
  const handleCloseImage = () => {
    setCurrentImage(null);
  };

  // Infinite scroll
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app-container">
      <header className="header">
        <h3>{typingText}</h3>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Search by author name..."
          className="search-input"
        />
      </header>
      <main className="gallery">
        {filteredImages.map((image) => (
          <div
            className="image-item"
            key={image.id}
            onClick={() => handleImageClick(image)}
          >
            <img
              src={image.download_url}
              alt={image.author}
              className="image"
            />
            <p className="author">By: {image.author}</p>
          </div>
        ))}
      </main>
      {isLoading && <p className="loading">Loading more images...</p>}

      {/* Modal for image view */}
      {currentImage && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={handleCloseImage}>
              &times;
            </span>
            <img
              src={currentImage.download_url}
              alt={currentImage.author}
              className="modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
