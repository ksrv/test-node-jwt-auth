export default {
  /**
   * Секретное слово
   */
  SECRET: process.env.SECRET || 'jhbjhbjhbsdfjghsdjfghbsjdfhbg',

  /**
   * Токен действителен 30 дней
   */
  TOKEN_EXPIRES: 60 * 60 * 24 * 30,
};