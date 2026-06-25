const fs = require('fs');
const path = require('path');

const basePath = path.join(__dirname, 'register-login', 'src', 'Frontend');

function fixFile(filename) {
    const filePath = path.join(basePath, filename);
    let c = fs.readFileSync(filePath, 'utf8');

    // Step 1: Replace the <a> tag style to remove position:relative and display:block
    const oldAStyle = "style={{textDecoration:'none', position:'relative', display:'block'}}>";
    const newAStyle = "style={{textDecoration:'none'}}>\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t<div style={{position:'relative',width:'180px',height:'180px',marginBottom:'12px'}}>";
    c = c.split(oldAStyle).join(newAStyle);

    // Step 2: Remove marginBottom from card-image div
    c = c.split("borderRadius: '16px', border: '1px solid #eee', marginBottom: '12px'")
         .join("borderRadius: '16px', border: '1px solid #eee'");

    // Step 3: Close the wrapper div before </a> (after overlay closing bracket)
    // The pattern is: )}\r\n<tabs></a>  => add </div> before </a>
    const oldClose = ")}\r\n\t\t\t\t\t\t\t\t\t\t\t\t</a>";
    const newClose = ")}\r\n\t\t\t\t\t\t\t\t\t\t\t\t\t</div>\r\n\t\t\t\t\t\t\t\t\t\t\t\t</a>";
    c = c.split(oldClose).join(newClose);

    fs.writeFileSync(filePath, c);
    console.log(filename + ' done');

    // Verify
    const lines = c.split('\n');
    const aLines = lines.filter(l => l.includes("style={{textDecoration:'none', position:'relative'"));
    console.log('  Remaining old-style <a> tags:', aLines.length);
    const wrapperLines = lines.filter(l => l.includes("position:'relative',width:'180px'"));
    console.log('  Wrapper divs added:', wrapperLines.length);
    const closeDivLines = lines.filter(l => l.includes("</div>") && l.trim() === '</div>');
    console.log('  </div> count (all):', closeDivLines.length);
}

fixFile('new.js');
fixFile('face.js');
