import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import { useId } from "react";
import * as Yup from "yup";
import { createNote } from "../../services/noteService";
import type { NoteTag } from "../../types/note";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const initialValues: FormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteFormProps {
  onClose: () => void;
  resetSearch: () => void;
}

const OrderFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
  content: Yup.string().max(500, "Content is too long"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(["Work", "Personal", "Meeting", "Shopping", "Todo"])
    .required("Tag is required"),
});

export default function NoteForm({ onClose, resetSearch }: NoteFormProps) {
  const queryClient = useQueryClient();
  const fieldId = useId();

  const handleSubmit = async (
    values: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    try {
      await createNote(values);

      actions.resetForm();

      resetSearch();
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note created successfully!");

      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={OrderFormSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            onClick={() => onClose()}
            className={css.cancelButton}
          >
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
