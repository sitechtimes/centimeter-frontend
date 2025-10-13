export type SlidesDropdown ={
    dropdown: string;
    typeOfSlide: string; /* This is going to be an id for the slide and it's gonna put up the type of slide when clicked */
}

export type MakePresentationSideBar = {
    name: string;
    ownComponents: string[]
}

export type ShowButtons = {
  name: string;
  path: string;
  dropdown?: { name: string;}[];
};