export const LETTER_PATTERN = /[a-zA-Z]/;
export const SPECIAL_CHARACTERS_PATTERN = /[!@#$%^&*(),.?":{}|<>]/;
export const NUMBER_PATTERN = /\d/;
export const YOUTUBE_PATTERN =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
export const CLOUDINARY_PATTERN = /^https?:\/\/(?:res.cloudinary.com\/[^\s/]+\/image\/upload\/v\d+\/[^\s]+\.\w+)$/i;
