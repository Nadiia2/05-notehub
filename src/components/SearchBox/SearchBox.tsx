// import { fetchNotes } from "../../services/noteService";
import css from "./SearchBox.module.css";
// import { useEffect, useState } from "react";

interface SearchBoxProps {
  onChange: (value: string) => void;
  value: string;
}

export default function SearchBox({ onChange, value }: SearchBoxProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      onChange={handleChange}
      value={value}
    />
  );
}
