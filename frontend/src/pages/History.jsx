import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("access");

        const response = await fetch(`${API_URL}/api/get-history/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Upload History</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item, index) => {
          // ✅ Log image path for debugging
          console.log("Image path:", item.image);

          // ✅ Normalize image URL
          const imageUrl = item.image.startsWith("/media/")
            ? `${API_URL}${item.image}`
            : `${API_URL}/media/${item.image}`;

          return (
            <div
              key={index}
              className="border rounded-xl shadow-md p-4 flex flex-col items-center"
            >
              <img
                src={item.image}
                alt={`Uploaded ${index}`}
                style={{ maxWidth: '100%', maxHeight: '300px' }}
                className="w-full max-w-[100px] h-[100px] object-cover rounded-md mb-2"
              />
              <p className="text-center font-medium">{item.caption}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default History;
