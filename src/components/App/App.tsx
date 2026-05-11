import { useState, useEffect } from "react";
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
import toast, { Toaster } from "react-hot-toast";
import NoteForm from "../NoteForm/NoteForm";

function App() {
  const [page, setPage] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [keyWord, setKeyWord] = useState("");
  // const [searchRequest, setSearchRequest] = useState("");
  // const [debouncedSearchRequest] = useDebounce(keyWord, 500);
  const handleChange = useDebouncedCallback((value: string) => {
    setKeyWord(value);
    setPage(1);
  }, 500);

  // const handleChange = useDebouncedCallback(setKeyWord, 500);
  // setPage(1);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    handleChange(value);
  };

  const { data, isLoading, isFetching, isError, isFetched } =
    useQuery<FetchNotesResponse>({
      queryKey: ["notes", keyWord, page],
      queryFn: () => fetchNotes(keyWord, page),
      // enabled: keyWord !== "",
      placeholderData: keepPreviousData,
    });

  const resetSearch = () => {
    setKeyWord("");
    setInputValue("");
    setPage(1);
  };

  useEffect(() => {
    if (isFetched && data?.notes?.length === 0) {
      toast.error("No notes found for your request.", {
        duration: 1500,
      });
    }
  }, [data, keyWord, isFetched]);

  return (
    <div className={css.app}>
      <Toaster position="top-center" reverseOrder={false} />
      <header className={css.toolbar}>
        {<SearchBox onChange={handleInputChange} value={inputValue} />}
        {isFetching || isLoading ? <p>Loading...</p> : null}
        {isError && <p>There was an error, please try again.</p>}
        {data && data.totalPages > 1 && (
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
      {data && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {isOpenModal && (
        <Modal onClose={() => setIsOpenModal(false)}>
          <NoteForm
            onClose={() => setIsOpenModal(false)}
            resetSearch={resetSearch}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;
