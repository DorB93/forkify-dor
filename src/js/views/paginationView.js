import View from './view';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

   addHandlerClick(handler){
    this._parentEl.addEventListener('click', (e)=>{
      const btn = e.target.closest('.btn--inline');
      if(!btn) return;
      const goToPage = Number(btn.dataset.goto);
      handler(goToPage);
    })
  }

  _generateMarkup(){
    const currPage = this._data.page;
    const numPages =Math.ceil(this._data.results.length / this._data.resultsPerPage) ;
    // Page 1, and there are other pages
    if (currPage === 1 && numPages > 1 ) {
      return `
        ${ this._generatNextButtonMarkup(currPage)} 
      `
    }
    
    // Last page
    if (currPage === numPages && numPages > 1 ) {
      return `
      ${ this._generatPrevButtonMarkup(currPage)}
        `;
    }
    
    // Other page
    if (currPage > 1 && currPage< numPages ) {
      return `
        ${ this._generatPrevButtonMarkup(currPage)}

        ${ this._generatNextButtonMarkup(currPage)} 
      `;
    }
    // Page 1, and there are NO other pages
    return '';
  }

  _generatPrevButtonMarkup(currPage){
    return `
    <button data-goto="${currPage - 1}" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currPage - 1}</span>
    </button>
    `
  }

  _generatNextButtonMarkup(currPage){
    return `
        <button data-goto="${currPage + 1}" class="btn--inline pagination__btn--next">
          <span>Page ${currPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button> 
    `
  }


}

export default new PaginationView();

