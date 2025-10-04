const DifficultyBadge = ({ difficulty }) => {
  const getDifficultyText = (diff) => {
    const difficultyMap = {
      LOW: "Baja",
      MEDIUM: "Media",
      HIGH: "Alta",
      EXTREME: "Extrema",
    };
    return difficultyMap[diff] || diff;
  };

  const difficultyClass = `difficulty-${difficulty.toLowerCase()}`;

  return (
    <span className={`difficulty-badge ${difficultyClass}`}>
      {getDifficultyText(difficulty)}
    </span>
  );
};

export default DifficultyBadge;
