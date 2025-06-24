const moodSelector = document.getElementById("mood-selector");
const thoughtInput = document.getElementById("thought-input");
const btnSubmit = document.getElementById("btn-submit");
const notesSection = document.getElementById("notes-section");
const notesList = document.getElementById("notes-list");

const moodLists = {
  Positive: [
    { value: "happy", label: "Happy 😊" },
    { value: "excited", label: "Excited 😆" },
    { value: "cheerful", label: "Cheerful 😄" },
    { value: "content", label: "Content 🙂" },
    { value: "relaxed", label: "Relaxed 😌" },
    { value: "graceful", label: "Graceful 🙏🏻" },
    { value: "confident", label: "Confident 😎" },
    { value: "hopeful", label: "Hopeful 🌟" },
    { value: "energetic", label: "Energetic ⚡" },
    { value: "loving", label: "Loving ❤️" },
    { value: "proud", label: "Proud 🏅" },
    { value: "amused", label: "Amused 😹" },
  ],
  Neutral: [
    { value: "neutral", label: "Neutral 😐" },
    { value: "meh", label: "Meh 😶" },
    { value: "tired", label: "Tired 😴" },
    { value: "bored", label: "Bored 😑" },
    { value: "calm", label: "Calm 😌" },
    { value: "indifferent", label: "Indifferent 😶‍🌫️" },
    { value: "focused", label: "Focused 🎯" },
    { value: "blank", label: "Blank 🫥" },
    { value: "curious", label: "Curious 🤔" },
  ],
  Negative: [
    { value: "sad", label: "Sad 😢" },
    { value: "angry", label: "Angry 😡" },
    { value: "frustrated", label: "Frustrated 😤" },
    { value: "anxious", label: "Anxious 😰" },
    { value: "stressed", label: "Stressed 😫" },
    { value: "jealous", label: "Jealous 😒" },
    { value: "guilty", label: "Guilty 😔" },
    { value: "embarrassed", label: "Embarrassed 😳" },
    { value: "lonely", label: "Lonely 😞" },
    { value: "depressed", label: "Depressed 😩" },
    { value: "fearful", label: "Fearful 😨" },
    { value: "hurt", label: "Hurt 💔" },
  ],
};

let thoughtsList = JSON.parse(localStorage.getItem("thoughts")) || [];

const displaySavedThoughts = () => {
  thoughtsList.forEach((thoughts) => {
    addThoughtsToList(thoughts);
  });
};

const populateDropdown = () => {
  for (const list in moodLists) {
    const optGroup = document.createElement("optgroup");
    optGroup.label = list;

    moodLists[list].forEach((mood) => {
      const option = document.createElement("option");
      option.value = mood.value;
      option.textContent = mood.label;
      optGroup.appendChild(option);
    });

    moodSelector.appendChild(optGroup);
  }
};

const addCategoryFilter = () => {
  const existingFilter = document.getElementById("category-filter");

  if (existingFilter) existingFilter.remove();

  if (thoughtsList.length === 0) return;

  const filter = document.createElement("select");
  filter.id = "category-filter";

  const defaultOption = document.createElement("option");
  defaultOption.selected = true;
  defaultOption.disabled = true;
  defaultOption.textContent = "-- Filter by category --";
  filter.appendChild(defaultOption);

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All";
  filter.appendChild(allOption);

  const categories = Object.keys(moodLists).map((category) => {
    return category.toLowerCase();
  });

  categories.forEach((category) => {
    const optionValue = document.createElement("option");
    optionValue.value = category;
    optionValue.textContent =
      category.charAt(0).toUpperCase() + category.slice(1);
    filter.appendChild(optionValue);
  });

  notesSection.insertBefore(filter, notesSection.firstChild);

  filter.addEventListener("change", () => {
    const selectedFilter = filter.value;

    [...notesList.children].forEach((listElement) => {
      if (selectedFilter === "all") {
        listElement.style.display = "";
        return;
      }

      listElement.style.display =
        listElement.dataset.category === selectedFilter ? "flex" : "none";
    });
  });
};

const renderSearchInput = () => {
  const existingSearch = document.getElementById("input-search");

  if (existingSearch) existingSearch.remove();

  const inputSearch = document.createElement("input");
  inputSearch.id = "input-search";
  inputSearch.placeholder = "Search a note...";

  const inputWrapper = document.createElement("div");
  inputWrapper.id = "search-wrapper";
  inputWrapper.appendChild(inputSearch);

  notesSection.insertBefore(inputWrapper, notesSection.childNodes[1]);

  inputSearch.addEventListener("input", () => {
    const searchValue = inputSearch.value.toLowerCase();

    [...notesList.children].forEach((noteItem) => {
      const note = noteItem.querySelector("span").textContent;

      if (!note.toLowerCase().includes(searchValue)) {
        noteItem.style.display = "none";
        return;
      }

      noteItem.style.display = "flex";
    });
  });
};

const addThoughts = () => {
  const moodIndex = moodSelector.selectedIndex;
  const selectedMood = moodSelector.options[moodIndex].text;
  const moodEmoji = selectedMood.split(" ").pop();
  const moodValue = selectedMood.split(" ").shift();
  const thought = thoughtInput.value.trim();

  let selectedMoodCategory = "";

  for (const category in moodLists) {
    const moodCategory = moodLists[category].find(
      (category) => category.value === moodSelector.value
    );

    if (moodCategory) {
      selectedMoodCategory =
        category.charAt(0).toLowerCase() + category.slice(1);
      break;
    }
  }

  if (moodSelector.selectedIndex <= 0 || thought === "") {
    alert("Please select a mood and write your thoughts.");
    return;
  }

  const newThought = {
    id: Date.now(),
    category: selectedMoodCategory,
    mood: moodValue.charAt(0).toLowerCase() + moodValue.slice(1),
    emoji: moodEmoji,
    thought: thought,
    timestamp: new Date().toLocaleString(),
  };

  addThoughtsToList(newThought);
  thoughtsList.push(newThought);
  localStorage.setItem("thoughts", JSON.stringify(thoughtsList));
  clearForm();
  renderNotesList();
  addCategoryFilter();
  renderSearchInput();
};

const addThoughtsToList = (thoughts) => {
  const thoughtItem = document.createElement("li");
  thoughtItem.dataset.id = thoughts.id;
  thoughtItem.dataset.mood = thoughts.mood;
  thoughtItem.dataset.category = thoughts.category;

  console.log(thoughts.category);

  switch (thoughts.category) {
    case "positive":
      thoughtItem.style.border = "1px solid #4caf50";
      break;
    case "neutral":
      thoughtItem.style.border = "1px solid #9e9e9e";
      break;
    case "negative":
      thoughtItem.style.border = "1px solid #f44336";
      break;
  }

  const thoughtContent = document.createElement("span");
  thoughtContent.textContent = `${thoughts.emoji}: ${thoughts.thought}`;

  const timestamp = document.createElement("small");
  timestamp.style.fontSize = "0.75rem";
  timestamp.style.opacity = "0.75";
  timestamp.textContent = thoughts.timestamp;

  const contentWrapper = document.createElement("div");
  contentWrapper.style.display = "flex";
  contentWrapper.style.flexDirection = "column";
  contentWrapper.style.gap = "0.35rem";
  contentWrapper.appendChild(timestamp);
  contentWrapper.appendChild(thoughtContent);

  const btnDelete = document.createElement("button");
  btnDelete.id = "btn-delete";
  btnDelete.textContent = "Delete";

  const btnEdit = document.createElement("button");
  btnEdit.id = "btn-edit";
  btnEdit.textContent = "Edit";

  const btnWrapper = document.createElement("div");
  btnWrapper.id = "btn-wrapper";
  btnWrapper.appendChild(btnEdit);
  btnWrapper.appendChild(btnDelete);

  btnEdit.addEventListener("click", () => {
    if (btnEdit.textContent === "Edit") {
      const editThoughtValue = document.createElement("input");
      editThoughtValue.style.flexGrow = "1";
      editThoughtValue.value = thoughts.thought;
      thoughtItem.replaceChild(editThoughtValue, contentWrapper);
      btnEdit.textContent = "Save";
      btnEdit.classList.add("btn-save-edit");
      return;
    }

    const editThoughtValue = thoughtItem.querySelector("input");
    const updateThoughtValue = editThoughtValue.value.trim();

    if (updateThoughtValue === "") {
      alert("Thought cannot be empty! Please write something");
      return;
    }

    thoughts.thought = updateThoughtValue;

    thoughtsList = thoughtsList.map((thought) =>
      thought.id === thoughts.id ? thoughts : thought
    );

    localStorage.setItem("thoughts", JSON.stringify(thoughtsList));

    thoughtContent.textContent = `${thoughts.emoji}: ${thoughts.thought}`;

    thoughtItem.replaceChild(contentWrapper, editThoughtValue);
    btnEdit.textContent = "Edit";
    btnEdit.classList.remove("btn-save-edit");
  });

  btnDelete.addEventListener("click", () => {
    notesList.removeChild(thoughtItem);

    thoughtsList = thoughtsList.filter((thought) => thought.id !== thoughts.id);

    localStorage.setItem("thoughts", JSON.stringify(thoughtsList));

    renderNotesList();
    addCategoryFilter();
    renderSearchInput();
  });

  thoughtItem.appendChild(contentWrapper);
  thoughtItem.appendChild(btnWrapper);
  notesList.appendChild(thoughtItem);

  console.log(thoughts);
};

const renderNotesList = () => {
  if (notesList.children.length === 0) {
    notesSection.style.display = "none";
    return;
  }

  notesSection.style.display = "grid";
};

const clearForm = () => {
  moodSelector.selectedIndex = 0;
  thoughtInput.value = "";
};

displaySavedThoughts();
addCategoryFilter();
renderSearchInput();
renderNotesList();
populateDropdown();

btnSubmit.addEventListener("click", addThoughts);

document.body.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addThoughts();
  }
});
