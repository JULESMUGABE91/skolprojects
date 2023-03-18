export default (level_percentage, just_collected) => {
  const level =
    !just_collected && level_percentage >= 0 && level_percentage < 40
      ? "low_level"
      : !just_collected && level_percentage >= 40 && level_percentage < 60
      ? "mid_low_level"
      : !just_collected && level_percentage >= 60 && level_percentage < 80
      ? "mid_high_level"
      : !just_collected && level_percentage >= 80
      ? "full_level"
      : just_collected
      ? "just_collected"
      : "empty_level";

  let color =
    level === "low_level"
      ? "#7a7d7a"
      : level === "mid_low_level"
      ? "rgb(121, 2, 121)"
      : level === "mid_high_level"
      ? "#000000"
      : level === "full_level"
      ? "#fd0c0c"
      : level === "just_collected"
      ? "#0530c6"
      : level === "low_level" && "#7a7d7a";

  return { level, color };
};
