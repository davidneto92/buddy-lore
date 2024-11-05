/**
 * Object used for select menus, containing a readable display and its corresponding data value.
 */
export interface ISelectOptions {
  /** React key for list rendering */
  key: string
  /** Data captured by the form */
  value: string | number
  /** Display value for the select option */
  display: string
}
