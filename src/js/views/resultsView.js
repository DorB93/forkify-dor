import PreviewView from './previewView';

class ReasultsView extends PreviewView {
  _parentEl = document.querySelector('.results');
  _errorMessage = 'No recipes Found for your search! please try again';
  _message =''

}
export default new ReasultsView();
