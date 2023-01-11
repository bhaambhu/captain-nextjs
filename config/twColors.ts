export default Object.freeze({
  twNavbarColors: ' bg-san-surface text-san-on-surface dark:bg-san-dark-surface dark:text-san-dark-on-surface ',
  twNavbarLinkColors: {
    current: ' text-san-primary dark:text-san-dark-primary ',
    others: '  '
  },

  primary: ' bg-san-primary text-san-on-primary dark:bg-san-dark-primary dark:text-san-dark-on-primary border-san-primary-container ',
  primaryContainer: ' bg-san-primary-container text-san-on-primary-container dark:bg-san-dark-primary-container dark:text-san-dark-on-primary-container border-current ',

  cross: ' text-san-delete dark:text-san-dark-delete ',
  crossContainer: ' text-san-delete-container dark:text-san-dark-delete-container ',

  // This is applied to path editor sidebar, you can add border color
  surface1: ' bg-san-primary/5 dark:bg-san-dark-primary/5 text-san-on-primary-container dark:text-san-dark-on-surface shadow-lg border-current ',
  // This is applied to topic editor sidebar
  surface2: ' bg-san-primary/10 dark:bg-san-dark-primary/10 dark:text-san-dark-on-surface shadow-xl border-current ',
  // This is applied to the big editor area
  surface3: ' bg-san-primary/20 dark:bg-san-dark-primary/20 dark:text-san-dark-on-surface shadow-2xl border-current ',
  
  surfaceSimple: ' bg-san-surface text-san-on-surface dark:bg-san-dark-surface dark:text-san-dark-on-surface shadow-lg border-current ',

  add: ' bg-san-additem dark:bg-san-dark-additem text-san-on-additem dark:text-san-dark-on-additem border-current ',
  addContainer: ' bg-san-additem-container dark:bg-san-dark-additem-container text-san-on-additem-container dark:text-san-dark-on-additem-container border-current ',

  remove: ' bg-san-removeitem text-san-on-removeitem dark:bg-san-dark-removeitem dark:text-san-dark-on-removeitem border-current ',
  removeContainer: ' bg-san-removeitem-container text-san-on-removeitem-container dark:bg-san-dark-removeitem-container dark:text-san-dark-on-removeitem-container border-current ',

  delete: ' bg-san-delete text-san-on-delete dark:bg-san-dark-delete dark:text-san-dark-on-delete border-current ',
  deleteContainer: ' bg-san-delete-container text-san-on-delete-container dark:bg-san-dark-delete-container dark:text-san-dark-on-delete-container border-current ',

  unsaved: ' bg-san-unsaved dark:bg-san-dark-unsaved text-san-on-unsaved dark:text-san-dark-on-unsaved border-san-unsaved-container ',
  unsavedContainer: ' bg-san-unsaved-container dark:bg-san-dark-unsaved-container text-san-on-unsaved-container dark:text-san-dark-on-unsaved-container border-current ',

  infoContainer: ' bg-san-info-container dark:bg-san-dark-info-container text-san-on-info-container dark:text-san-dark-on-info-container border-current ',

  error: ' bg-san-error dark:bg-san-dark-error text-san-on-error dark:text-san-dark-on-error border-san-error-container ',
  errorContainer: ' bg-san-error-container dark:bg-san-dark-error-container text-san-on-error-container dark:text-san-dark-on-error-container border-current ',

  inputField: ' bg-san-surface text-san-on-surface dark:bg-san-dark-surface dark:text-san-dark-on-surface border-current ',

  disabledContainer: ' bg-san-surface-variant text-san-on-surface-variant dark:bg-san-dark-surface-variant dark:text-san-dark-on-surface-variant border-current ',

  // For CheckboxPill Element
  checked: ' bg-blue-500 accent-blue-500 text-san-on-primary ',
  unchecked: ' bg-san-on-surface dark:bg-san-dark-on-surface text-san-surface dark:text-san-dark-surface ',

  
  
  // For modals and windows
  window: ' bg-san-primary-container text-san-on-primary-container border-current ',

  // For highlighted text
  textHL: ' text-san-primary dark:text-san-dark-primary ',
})