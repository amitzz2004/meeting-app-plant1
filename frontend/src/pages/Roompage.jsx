import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/axios";
import RoomCalendarGrid from "../components/RoomCalendarGrid";
import deeLogo from "../assets/DEEclean.png";
import sc1 from "../assets/smallrooms.jpg";
import sc2 from "../assets/smallconf2.jpg";
import boardroom from "../assets/boardroom.jpg";
import trainingroom from "../assets/trainingroom.jpg";

const roomImages = [sc1, sc2, sc1, sc2, sc1];

function groupRooms(rooms) {
  const categories = {};

  rooms.forEach((room) => {
    let categoryKey = "Other";
    if (room.name.toLowerCase().includes("small conference")) {
      categoryKey = "Small Conference";
    } else if (room.name.toLowerCase().includes("board")) {
      categoryKey = "Board Room";
    } else if (room.name.toLowerCase().includes("training")) {
      categoryKey = "Training Room";
    }

    if (!categories[categoryKey]) {
      categories[categoryKey] = {
        name: categoryKey === "Small Conference" ? "Small Conference Rooms" : categoryKey,
        rooms: [],
      };
    }
    categories[categoryKey].rooms.push(room);
  });

  return Object.values(categories).map((cat) => ({
    ...cat,
    rooms: cat.rooms.map((room, i) => ({
      ...room,
      image: cat.name.includes("Small Conference")
        ? roomImages[i % roomImages.length]
        : cat.name.includes("Board")
        ? boardroom
        : trainingroom,
    })),
  }));
}

export default function RoomPage() {
  const { categoryIndex } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get("/rooms");
        const grouped = groupRooms(res.data);
        setCategories(grouped);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const category = categories[Number(categoryIndex)];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading rooms...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 text-lg mb-4">Category not found.</p>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-[#0f172a] font-medium hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navy Header with Logo */}
      <div className="bg-[#0b2c4a] text-white py-5 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={deeLogo}
              alt="DEE Piping Systems"
              className="w-12 h-12 object-contain"
            />
            <div>
              <h1 className="text-base tracking-wide font-semibold text-[#4333a5]">
                <span className="text-red-600">DEE</span>{" "}
                <span className="text-[#4333a5]">PIPING SYSTEM</span>
              </h1>
              <p className="text-xs text-slate-400">
                Inhouse Meeting Room Booking Platform
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pt-4 pb-8">
        {/* Back button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium mb-6 transition-colors"
        >
          ← Back to Dashboard
        </button>

        {/* Room category info */}
        <div className="mb-3 flex items-center gap-2">
          <p className="text-base text-slate-600 mt-1 flex items-center gap-1 font-bold">
            <span className="text-[#0EA5E9]"></span>
            Kindly select a suitable meeting slot and confirm
          </p>
        </div>

        {/* Calendar grid */}
        <div className="bg-white rounded-3xl shadow-xl p-6 overflow-hidden">
          <RoomCalendarGrid rooms={category.rooms} />
        </div>
      </div>
    </div>
  );
}