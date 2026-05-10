import { useState } from "react";
import NoteList from "../NoteList/NoteList";
import css from "./App.module.css";
import {
  fetchNotes,
  type FetchNotesResponse,
} from "../../services/noteService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";

function App() {
  const [keyWord, setKeyWord] = useState("");
  const [page, setPage] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState(false);
  // const [searchRequest, setSearchRequest] = useState("");
  // const [debouncedSearchRequest] = useDebounce(keyWord, 500);

  const { data } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", keyWord, page],
    queryFn: () => fetchNotes(keyWord, page),
    // enabled: keyWord !== "",
    placeholderData: keepPreviousData,
  });

  const handleChange = useDebouncedCallback((value: string) => {
    setKeyWord(value);
    setPage(1);
  }, 500);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox onChange={handleChange} value={keyWord} />}
        {data?.totalPages && data?.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}
        {
          <button className={css.button} onClick={() => setIsOpenModal(true)}>
            Create note +
          </button>
        }
      </header>
      {data?.notes && data?.notes.length > 0 && <NoteList notes={data.notes} />}
      {isOpenModal && <Modal onClose={() => setIsOpenModal(false)} />}
    </div>
  );
}

export default App;
