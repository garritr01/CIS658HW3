//local
//const mainURL = "http://127.0.0.1:5500/CIS658HW3/images/";
//remote
const mainURL = "https://raw.githubusercontent.com/garritr01/CIS658HW3/main/images/"

function expansionCorrection(log = 0) {
  document.querySelectorAll('.acronym').forEach(acronym => {
    acronym.addEventListener('mouseenter', function () {
      log > 0 && console.log('-- -- -- expansion -- -- --');
      // get .expand element
      const expandBox = this.querySelector('.expand');

      // center over .acronym
      expandBox.style.display = '-webkit-box';
      expandBox.style.left = `${-50 * (expandBox.offsetWidth / this.offsetWidth - 1)}%`;

      // get bounding rectangles
      const expandRect = expandBox.getBoundingClientRect();
      const acroRect = this.getBoundingClientRect();

      // get screen styling info
      const width = document.body.scrollWidth;
      const bodyStyle = window.getComputedStyle(document.body);
      const paddingLeft = parseInt(bodyStyle.marginLeft, 10);
      // get expansion styling info
      const expandStyle = window.getComputedStyle(expandBox);
      const xPadding = parseInt(expandStyle.paddingLeft) + parseInt(expandStyle.paddingRight);

      // calculate required number of lines for expansion
      let i = 1;
      while ((expandRect.width + xPadding) > i * (width - 1)) {
        i++;
      }
      // If multiple lines are required
      if (i > 1) {
        expandBox.style.top = `-${i * 100}%`;
        expandBox.style.whiteSpace = 'normal';
        expandBox.style.width = `${width - 1}px`;
        expandBox.style.webkitLineClamp = `${i}`;
        expandBox.style.left = `${-100 * (acroRect.left - paddingLeft) / acroRect.width}%`;
        expandBox.style.right = 'auto';
      } else {
        // if the box would extend above the page, put it below the .acronym
        if (expandRect.top <= 0) {
          expandBox.style.top = '100%';
          log > 0 && console.log(`Expansion placed below ${acroRect.top}px`);
        } else if (log > 0) {
          console.log(`Expansion placed above ${acroRect.top}px`);
        }

        // if the box would extend beyond the page pin it to the side
        if (expandRect.right > width) {
          expandBox.style.right = `${100 * (acroRect.right - width) / acroRect.width}%`;
          expandBox.style.left = 'auto';
          log > 0 && console.log(`Expansion pinned to right @ ${width}px`);
        } else if (expandRect.left < 0) {
          expandBox.style.left = `${-100 * (acroRect.left - paddingLeft) / acroRect.width}%`;
          expandBox.style.right = 'auto';
          log > 0 && console.log(`Expansion pinned to left @ 0px`);
        } else if (log > 0) {
          console.log(`Expansion centered at ${(acroRect.left + acroRect.right) / 2}`);
        }
      }

      if (log > 1) {
        console.log(`screen width: ${width}`);
        console.log(`acronymEdge: ${acroRect.right}`);
        console.log(`paddingLeft: ${paddingLeft}`);
        console.log('acronym', acroRect);
        console.log('initial expansion', expandRect);
        console.log('updated expansion', expandBox.getBoundingClientRect());
      }
    });

    acronym.addEventListener('mouseleave', function () {
      const expandBox = this.querySelector('.expand');

      // Reset styles back to initial values
      expandBox.style.display = 'none';
      expandBox.style.position = 'absolute';
      expandBox.style.top = '-100%';
      expandBox.style.backgroundColor = '#d7e5ee';
      expandBox.style.border = '1px solid #4c4c6f';
      expandBox.style.whiteSpace = 'nowrap';

      // Explicitly clear left and right to avoid lingering values
      expandBox.style.left = '';
      expandBox.style.right = '';
      expandBox.style.width = '';
      expandBox.style.webkitLineClamp = '';
    });
  });
}

function dropdown(elementID, log = 0) {
  // select all dropdownLinks and add a click listener
  document.querySelectorAll('.dropdownLink,.h2DropdownLink').forEach(dLink => {
    dLink.addEventListener('click', function () {

      // get tag and use to choose dropdown content
      const name = this.getAttribute("tag");
      const ddBox = document.querySelector(`.dropdown[tag="${name}"]`);

      //route to images directory + specified image
      const bkgIn = ddBox.getAttribute("bkg") || null;
      const bkg = mainURL + bkgIn;

      //check for background image object
      let bkgImg = ddBox.querySelector('.bkgImg') || null;

      //create background image object if specified and not existing
      if (!bkgIn) {
        log > 0 && console.log(`No background image request.`);
      } else if (bkgImg) {
        log > 0 && console.log(`${bkgIn} class found`);
      } else {
        const bkgImg = document.createElement('div');
        bkgImg.className = 'bkgImg';
        bkgImg.style.backgroundImage = `url('${bkg}')`;
        bkgImg.style.width = '100%';
        bkgImg.style.height = '100%';
        bkgImg.style.left = '0';
        bkgImg.style.zIndex = bkgImg.style.zIndex + 100;
        ddBox.prepend(bkgImg);
        log > 0 && console.log(`${bkgIn} class not found, was created`);
      }

      log > 0 && console.log(`tag: ${name}`);

      // if rendered remove, else add
      if (ddBox.style.display === "block") {
        ddBox.style.display = 'none';
        this.classList.remove('active');
        log > 1 && console.log("removing visibility of: ", name);
      } else {
        ddBox.style.display = 'block';
        this.classList.add('active');
        log > 1 && console.log(`displaying: ${name} with background image from ${bkg}`);
      }

    });
  });
}

function infoBox(elementID, log = 0) {
  document.querySelectorAll('.displayOptions').forEach(disp => {
    const dispTag = disp.getAttribute('tag');
    const selections = document.querySelector(`.displaySelections[tag="${dispTag}"]`);

    disp.querySelectorAll('.displayLink').forEach(link => {
      link.addEventListener('click', function () {
        // Get tag and use to choose info box content
        const name = this.getAttribute("contentTag");
        const element = selections.querySelector(`.displayText[contentTag="${name}"]`);

        log > 0 && console.log(`${name} current display: ${element.style.display}`);

        if (element.style.display !== 'block') {
          log > 0 && console.log('Activating ' + this.textContent);
          log > 0 && console.log('Inserting ', element.textContent.slice(0, 10));
          this.classList.add('active');
          element.style.display = 'block';
          wrapDisplay(specific = '.displayText', log = log);
        } else {
          log > 0 && console.log('Deactivating ' + this.textContent);
          log > 0 && console.log('Removing ', element.textContent.slice(0, 10));
          this.classList.remove('active');
          element.style.display = "none";
          wrapDisplay(specific = '.displayText', log = log);
        }
        // Indicate size change to main body
        window.parent.postMessage({ type: 'mainHeight', height: document.body.scrollHeight, elementID: elementID }, '*');
      });
    });
  });
}