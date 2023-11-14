type T = string | { [key: string]: T };

export default interface TranslationMessages {
  TITLE: string;
  NAVIGATION: {
    PROJECTS: string;
  };

  [key: string]: T;
}