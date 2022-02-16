const SelectOption = ({ tags, tagsA, handleTagDelete, handleChangeTag }) => {
  return (
    <>
      {tags.map((tag) => (
        <div key={tag._id}>
          {`${tag.title}  `}
          <span onClick={() => handleTagDelete(tag)}>x</span>
        </div>
      ))}
      <select
        name="tags"
        multiple={true}
        onChange={handleChangeTag}
        value={tags}
      >
        {tagsA.map((tag) => (
          <option key={tag._id} name={tag.title} value={tag._id}>
            {tag.title}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectOption;
