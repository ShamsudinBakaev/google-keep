import React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';

import { useDispatch } from 'react-redux';
import { setStatus } from '../redux/notesSlice';

const CreateNote = () => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [form, setForm] = React.useState({
    title: '',
    note: '',
  });

  const dispatch = useDispatch();

  const handleExpandClick = () => {
    setIsExpanded(true);
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleAddNote = async () => {
    try {
      dispatch(setStatus('loading'));

      await addDoc(collection(db, 'home'), {
        title: form.title,
        note: form.note,
        pinned: false,
        timestamp: serverTimestamp(),
      });

      dispatch(setStatus('succeeded'));
      console.log('Документ успешно добавлен');

      setIsExpanded(false);
      setForm({
        title: '',
        note: '',
      });
    } catch (e) {
      dispatch(setStatus('failed'));
      console.error('Ошибка при добавлении документа: ', e);
    }
  };

  return (
    <div className="component-create-note" id="">
      <div className="input">
        {isExpanded ? (
          <>
            <TextareaAutosize
              className="input-title"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              maxLength={250}
              placeholder="Title"
            />
            <TextareaAutosize
              className="input-note"
              name="note"
              value={form.note}
              onChange={handleInputChange}
              maxLength={5000}
              placeholder="Note"
              autoFocus
            />
          </>
        ) : (
          <>
            <TextareaAutosize
              className="input-note"
              placeholder="Note..."
              value={''}
              onClick={handleExpandClick}
            />
          </>
        )}
      </div>

      {isExpanded && (
        <div className="bottom-control-panel">
          <div className="block-left"></div>
          <div className="block-right">
            <button onClick={handleAddNote}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateNote;
