import React from "react";
import { useNavigate } from "react-router-dom";
import "./TaskCard.css";

const TaskCard = ({ task }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/task/${task.id}`);
  };

  return (
    <div className="task-card" onClick={handleClick}>
      <h4>{task.name}</h4>
      <p>{task.status}</p>
    </div>
  );
};

export default TaskCard;
