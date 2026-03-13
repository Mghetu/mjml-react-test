import type { Editor } from 'grapesjs';

export default function registerPrebuiltBlocks(editor: Editor) {
  const bm = editor.Blocks;

  const add = (
    id: string,
    label: string,
    category: string,
    content: string,
    media?: string,
  ) => {
    bm.add(id, {
      label,
      category,
      media: media ?? '📦',
      content,
      select: true,
      activate: true,
    });
  };

  // ===== MEM (examples) =====
  add(
    'header with logo',
    'MEM · header with logo',
    'MEM',
    `
 <mj-section padding-top="10px" padding-bottom="10px" text-align="left" background-color="#000000">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          <mj-image src="https://media.deloitte.com/is/image/deloitte/Logo_Deloitte_newsletter_MEM_101" padding-top="0px" padding-bottom="0px" align="left" width="170px">
          </mj-image>
        </mj-column>
      </mj-section>`
  );

  add(
    'mem-hero',
    'MEM · Hero',
    'MEM',
    `
  <mj-section padding-top="0px" padding-bottom="0px">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          <mj-text font-family="Aptos, Calibri, sans-serif" font-size="10px" color="#8f8f8f">Market Eminence Monitor | For internal use only
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section padding-top="0px" padding-bottom="0px">
        <mj-column padding-top="0px" padding-bottom="0px" padding-left="0px" padding-right="0px">
          <mj-image src="https://media.deloitte.com/is/image/deloitte/Header_%20newsletter_MEM" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          </mj-image>
        </mj-column>
      </mj-section>
      <mj-section padding-top="10px" padding-bottom="10px" background-color="#ffffff">
        <mj-column>
          <mj-text font-size="32px" font-family="Aptos, Calibri, sans-serif" font-weight="700">Market Eminence Monitor
          </mj-text>
          <mj-text font-family="Aptos, Calibri, sans-serif">Our sushi bar has some amazing sushi with great variety, as well as dishes from other Asian regions including Korea, Japan, Thailand and Cambodia. We get our ingredients from local producers whenever possible.
          </mj-text>
        </mj-column>
      </mj-section>`
  );


 add(
    'Mem numbers',
    'MEM · numbers',
    'MEM',
    `
   <mj-section padding-top="0px" padding-bottom="0px">
        <mj-column>
          <mj-text font-family="Aptos, Calibri, sans-serif" font-weight="700">FY26 Numbers to Date  
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section padding-top="5px" padding-bottom="5px">
        <mj-group>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px">
            <mj-image src="https://placehold.co/150x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="5px" padding-left="5px">
            <mj-image src="https://placehold.co/150x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="10px">
            <mj-image src="https://placehold.co/150x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            </mj-image>
          </mj-column>
        </mj-group>
      </mj-section>
      <mj-section padding-top="5px" padding-bottom="0px">
        <mj-group>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px">
            <mj-image src="https://placehold.co/150x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="5px" padding-left="5px">
            <mj-image src="https://placehold.co/150x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="10px">
            <mj-image src="https://placehold.co/150x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            </mj-image>
          </mj-column>
        </mj-group>
      </mj-section>`
  );




    add(
    'MEM-special feature',
    'MEM · special feature',
    'MEM',
    `
<mj-section padding-top="0px" padding-bottom="0px">
        <mj-column vertical-align="bottom" padding-right="0px" padding-left="0px" padding-bottom="0px" padding-top="16px">
          <mj-divider padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" border-color="#8db924">
          </mj-divider>
        </mj-column>
      </mj-section>
      <mj-section padding-left="25px" padding-right="25px" background-color="#e6e6e6">
        <mj-group>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="10%">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Circle_category_gri_100" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" align="left" width="60px">
            </mj-image>
          </mj-column>
          <mj-column width="90%" padding-top="0px" padding-bottom="0px" padding-left="0px" padding-right="0px">
            <mj-raw>
              <a name="LINK1" id="LINK1"></a>
            </mj-raw>
            <mj-text padding-top="0px" padding-bottom="0px" padding-left="20px" font-size="28px" font-family="Aptos, Calibri, sans-serif" font-weight="700">Special Features 
            </mj-text>
            <mj-text padding-top="5px" padding-bottom="0px" padding-left="20px" font-size="16px" font-family="Aptos, Calibri, sans-serif" font-weight="700" color="#a8a8a8">Published February 23-27, 2026
              <br/>
            </mj-text>
          </mj-column>
        </mj-group>
      </mj-section>
      <mj-section padding-left="25px" padding-right="25px" padding-top="10px" padding-bottom="10px" background-color="#e6e6e6">
        <mj-group>
          <mj-column width="40%" vertical-align="middle" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            <mj-image src="https://placehold.co/200x110" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" align="left">
            </mj-image>
          </mj-column>
          <mj-column width="60%" vertical-align="middle" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            <mj-text padding-top="0px" padding-bottom="3px" padding-right="10px" padding-left="10px" font-family="Aptos, Calibri, sans-serif" font-size="15px" font-weight="400" line-height="16px">Ionescu Popescu- function &amp; Ionescu Popescu- function &amp; Ionescu Popescu- function &amp; Ionescu Popescu- function &amp; Ionescu Popescu- function &amp;
              <br/>dsadsadasdad
            </mj-text>
            <mj-text padding-top="0px" padding-bottom="3px" padding-right="10px" padding-left="10px" color="#5849e4" text-decoration="underline" font-family="Aptos, Calibri, sans-serif" font-size="12px" font-weight="500">
              <a>vezi articol &gt;</a>
            </mj-text>
          </mj-column>
        </mj-group>
      </mj-section>`
  );


  




  

  add(
    'MEM-category',
    'MEM · category',
    'MEM',
    `
 <mj-section padding-top="0px" padding-bottom="0px">
        <mj-column vertical-align="bottom" padding-right="0px" padding-left="0px" padding-bottom="0px" padding-top="16px">
          <mj-divider padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" border-color="#8db924">
          </mj-divider>
        </mj-column>
      </mj-section>
      <mj-section padding-left="25px" padding-right="25px" background-color="#ffffff">
        <mj-group>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="10%">
            <mj-image src="https://placehold.co/50x50" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" align="left" width="60px">
            </mj-image>
          </mj-column>
          <mj-column width="90%" padding-top="0px" padding-bottom="0px" padding-left="0px" padding-right="0px">
            <mj-text padding-top="0px" padding-bottom="0px" padding-left="20px" font-size="28px" font-family="Aptos, Calibri, sans-serif" font-weight="700">Press Releases 
            </mj-text>
            <mj-text padding-top="5px" padding-bottom="0px" padding-left="20px" font-size="16px" font-family="Aptos, Calibri, sans-serif" font-weight="700" color="#a8a8a8">Published x-y month
            </mj-text>
          </mj-column>
        </mj-group>
      </mj-section>`
  );



  add(
    'MEM-press-release-item',
    'MEM · press release item',
    'MEM',
    `
  <mj-section padding-left="25px" padding-right="25px" padding-top="10px" padding-bottom="0px" background-color="#ffffff">
        <mj-column width="100%" padding-top="0px" padding-bottom="5px" padding-right="0px" padding-left="0px">
          <mj-image src="https://placehold.co/600x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          </mj-image>
        </mj-column>
      </mj-section>
      <mj-section padding-left="25px" padding-right="25px" padding-top="0px" padding-bottom="10px" background-color="#ffffff">
        <mj-column width="100%" padding-top="0px" padding-right="0px" padding-bottom="0px" padding-left="0px">
          <mj-text padding-top="0px" padding-bottom="3px" padding-left="10px" font-family="Aptos, Calibri, sans-serif" font-size="16px" font-weight="700">Ionescu Popescu- function &amp; Ionescu Popescu- function
          </mj-text>
          <mj-text padding-top="0px" padding-bottom="3px" padding-left="10px" font-family="Aptos, Calibri, sans-serif" font-size="14px" font-weight="700" color="#767676">The evolving role of consultants in the AI era and add very long title here
          </mj-text>
          <mj-text padding-top="0px" padding-bottom="3px" padding-left="10px" color="#5849e4" text-decoration="underline" font-family="Aptos, Calibri, sans-serif" font-size="12px" font-weight="500">vezi articol &gt;
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section padding-top="0px" padding-bottom="0px" background-color="#ffffff">
        <mj-column padding-top="5px" padding-bottom="5px" padding-right="0px" padding-left="0px">
          <mj-divider border-width="1px" border-color="#dbdbdb" padding-top="5px" padding-bottom="5px">
          </mj-divider>
        </mj-column>
      </mj-section>`
  );



 add(
    'MEM-press-release-end-with_images',
    'MEM · 2-links',
    'MEM',
    `
 <mj-section padding-top="10px" padding-bottom="0px" background-color="#ffffff">
        <mj-group>
          <mj-column width="50%" padding-top="0px" padding-bottom="0px">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Deloitte_press_releases_100" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" href="https://bit.ly/47GqwHK">
            </mj-image>
          </mj-column>
          <mj-column width="50%" padding-top="0px" padding-bottom="0px">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/R_A_press_releases%20_100" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" href="https://bit.ly/3Ls1xz6">
            </mj-image>
          </mj-column>
        </mj-group>
      </mj-section>`
  );
  


 add(
    'MEM-Opinion-Articles-item',
    'MEM · Opinion Articles item',
    'MEM',
    `
   <mj-section padding-left="25px" padding-right="25px" padding-top="10px" padding-bottom="10px" background-color="#ffffff">
        <mj-group>
          <mj-column width="40%" vertical-align="middle" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            <mj-image src="https://placehold.co/200x110" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" align="left">
            </mj-image>
          </mj-column>
          <mj-column width="60%" vertical-align="middle" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            <mj-text padding-top="0px" padding-bottom="3px" padding-right="10px" padding-left="10px" font-family="Aptos, Calibri, sans-serif" font-size="16px" font-weight="700">Ionescu Popescu- function &amp; Ionescu Popescu- function &amp; Ionescu Popescu- function &amp; Ionescu Popescu- function &amp; Ionescu Popescu- function &amp;
            </mj-text>
            <mj-text padding-top="0px" padding-bottom="3px" padding-right="10px" padding-left="10px" font-family="Aptos, Calibri, sans-serif" font-size="14px" font-weight="700" color="#767676">Titlu press release, dsadsad dsadsadsd dsadsada, dsasdad, dsasadadadsa, dsaadda,
            </mj-text>
            <mj-text padding-top="0px" padding-bottom="3px" padding-right="10px" padding-left="10px" color="#5849e4" text-decoration="underline" font-family="Aptos, Calibri, sans-serif" font-size="12px" font-weight="500">vezi articol &gt;
            </mj-text>
          </mj-column>
        </mj-group>
      </mj-section>`
  );


   add(
    'MEM-opinion-articles-end-with_images',
    'MEM · 2-links',
    'MEM',
    `
 <mj-section padding-top="10px" padding-bottom="0px" background-color="#ffffff">
        <mj-group>
          <mj-column width="50%" padding-top="0px" padding-bottom="0px">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Deloitte_opinion_articles_100" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" href="https://bit.ly/4qo5btU">
            </mj-image>
          </mj-column>
          <mj-column width="50%" padding-top="0px" padding-bottom="0px">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/R_A_opinion_articles_100" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" href="https://bit.ly/3Ls1MKw">
            </mj-image>
          </mj-column>
        </mj-group>
      </mj-section>`
  );
  

 add(
    'MEM-Third-Party-Events-item',
    'MEM · Third Party Events item',
    'MEM',
    `
   <mj-section padding-left="25px" padding-right="25px" padding-top="10px" padding-bottom="10px" background-color="#ffffff">
        <mj-group>
          <mj-column width="70%" padding-right="10px" padding-top="0px" padding-bottom="0px" padding-left="0px">
            <mj-text padding-top="0px" color="#a4a4a4" padding-bottom="3px" padding-right="0px" font-family="Aptos, Calibri, sans-serif" font-weight="700" font-size="16px" padding-left="0px">15 sept 2025  | 15:00 
            </mj-text>
            <mj-text padding-top="0px" color="#3d3d3d" padding-bottom="3px" padding-right="0px" font-family="Aptos, Calibri, sans-serif" font-size="14px" font-weight="700" padding-left="0px">Titlu press release, dsadsad dsadsadsd dsadsada, dsasdad, dsasadadadsa, dsaadda,
            </mj-text>
            <mj-text padding-top="0px" padding-bottom="5px" padding-right="0px" font-family="Aptos, Calibri, sans-serif" color="#000000" padding-left="0px" font-weight="700" font-size="14px">Nume and function purtator de mesaj
            </mj-text>
            <mj-text padding-top="0px" color="#000000" padding-bottom="3px" padding-right="0px" font-family="Aptos, Calibri, sans-serif" padding-left="0px" font-size="14px">Marketing contact
            </mj-text>
          </mj-column>
          <mj-column width="30%" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            <mj-image src="https://placehold.co/200x100" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" align="left">
            </mj-image>
          </mj-column>
        </mj-group>
      </mj-section>`
  );



     add(
    'MEM-3rd-party-end-with_images',
    'MEM · 1-links',
    'MEM',
    `
 <mj-section padding-top="10px" padding-bottom="0px" background-color="#ffffff">
        <mj-column padding-top="0px" padding-bottom="0px">
          <mj-image src="https://media.deloitte.com/is/image/deloitte/events_by_other_entities_100" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" href="https://bit.ly/4hs7Z5o">
          </mj-image>
        </mj-column>
      </mj-section>`
  );

 add(
    'MEM-Deloitte-Events-item',
    'MEM · Deloitte Events item',
    'MEM',
    `
     <mj-section padding-left="25px" padding-right="25px" padding-top="10px" padding-bottom="10px" background-color="#ffffff">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          <mj-text padding-top="0px" padding-bottom="3px" padding-left="0px" padding-right="0px" font-family="Aptos, Calibri, sans-serif" font-size="16px" font-weight="700" color="#a4a4a4">15 sept 2025  | 15:00 |
          </mj-text>
          <mj-text padding-top="0px" padding-bottom="3px" padding-left="0px" padding-right="0px" font-family="Aptos, Calibri, sans-serif" font-size="16px" font-weight="400">Titlu press release, dsadsad dsadsadsd dsadsada, dsasdad, dsasadadadsa, dsaadda,
          </mj-text>
          <mj-text padding-top="0px" padding-bottom="3px" padding-left="0px" padding-right="0px" font-family="Aptos, Calibri, sans-serif" font-size="14px" font-weight="700">Nume and function purtator de mesaj
          </mj-text>
          <mj-text padding-top="0px" padding-bottom="3px" padding-left="0px" padding-right="0px" font-family="Aptos, Calibri, sans-serif" font-size="14px" font-weight="400">Marketing contact
          </mj-text>
        </mj-column>
      </mj-section>`
  );
  
     add(
    'MEM-D-events-end-with_images',
    'MEM · 1-links',
    'MEM',
    `
  <mj-section padding-top="10px" padding-bottom="0px" background-color="#ffffff">
        <mj-column padding-top="0px" padding-bottom="0px">
          <mj-image src="https://media.deloitte.com/is/image/deloitte/all_Deloitte_events_100" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" href="https://bit.ly/4hoWLP7">
          </mj-image>
        </mj-column>
      </mj-section>`
  );

 add(
    'MEM-end-of-section-1-banner',
    'MEM · 1-banner',
    'MEM',
    `
 <mj-section padding-top="10px" padding-bottom="0px" background-color="#ffffff">
        <mj-column padding-top="0px" padding-bottom="0px">
          <mj-image src="https://placehold.co/600x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          </mj-image>
        </mj-column>
      </mj-section>`
  );

  
 add(
    'MEM-newsletter-banner',
    'MEM · newsletter-banner',
    'MEM',
    `
 <mj-section padding-left="25px" padding-right="25px" padding-top="10px" padding-bottom="10px" background-color="#ffffff">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          <mj-image src="https://media.deloitte.com/is/image/deloitte/Newsletters_all_banner_100" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" border-radius="40px 40px 40px 40px" href="https://bit.ly/3JCr1JE">
          </mj-image>
        </mj-column>
      </mj-section>`
  );



 add(
    'MEM-SoMe-section-and-Mk-Leader',
    'MEM · SoMe-section-and-Mk-Leader',
    'MEM',
    `
      <mj-section padding-left="25px" padding-right="25px" padding-top="10px" padding-bottom="10px" background-color="#ffffff">
        <mj-group>
          <mj-column width="50%" padding-top="0px" padding-bottom="0px" padding-right="5px" padding-left="0px">
            <mj-text padding-top="5px" padding-bottom="5px" padding-left="0px" font-size="16px" font-family="Aptos, Calibri, sans-serif" font-weight="700">Best performing 
              <br/>Deloitte LinkedIn Post
            </mj-text>
            <mj-image src="https://placehold.co/330x330" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" align="left">
            </mj-image>
            <mj-divider border-width="2px" border-color="#b1b1b1" padding-right="0px" padding-left="0px">
            </mj-divider>
            <mj-text padding-top="5px" padding-bottom="5px" padding-left="0px" font-size="16px" font-family="Aptos, Calibri, sans-serif" font-weight="700">Check Deloitte Romania posts here
            </mj-text>
            <mj-social font-size="12px" icon-size="24px" border-radius="12px" mode="horizontal" align="left" font-family="Aptos, Calibri, sans-serif" padding-left="0px">
              <mj-social-element name="linkedin" background-color="#8db924" href="https://bit.ly/4nIVdRD">
              </mj-social-element>
              <mj-social-element name="facebook" background-color="#8db924" href="https://bit.ly/47arNqp">
              </mj-social-element>
              <mj-social-element name="facebook" background-color="#8db924" href="https://bit.ly/3JsRbyu">
              </mj-social-element>
              <mj-social-element name="instagram" background-color="#8db924" href="https://bit.ly/4oaiJYx">
              </mj-social-element>
            </mj-social>
          </mj-column>
          <mj-column width="50%" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="5px">
            <mj-text padding-top="5px" padding-bottom="5px" padding-left="0px" font-size="16px" font-family="Aptos, Calibri, sans-serif" font-weight="700">Bet performing Reff &amp; Associates LinkedIn Post
            </mj-text>
            <mj-image src="https://placehold.co/330x330" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" align="left">
            </mj-image>
            <mj-divider border-width="2px" border-color="#b1b1b1" padding-right="0px" padding-left="0px">
            </mj-divider>
            <mj-text padding-top="5px" padding-bottom="5px" padding-left="0px" font-size="16px" font-family="Aptos, Calibri, sans-serif" font-weight="700">Check Reff &amp; Associates posts here. 
            </mj-text>
            <mj-social font-size="12px" icon-size="24px" border-radius="12px" mode="horizontal" align="left" font-family="Aptos, Calibri, sans-serif" padding-left="0px">
              <mj-social-element name="linkedin" background-color="#00737f" href="https://bit.ly/3JhNPOS">
              </mj-social-element>
              <mj-social-element name="facebook" background-color="#00737f" href="https://bit.ly/3Jsmqd3">
              </mj-social-element>
            </mj-social>
          </mj-column>
        </mj-group>
      </mj-section>
      <mj-section padding-top="0px" padding-bottom="0px">
        <mj-column vertical-align="bottom" padding-right="0px" padding-left="0px" padding-bottom="0px" padding-top="16px">
          <mj-divider padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          </mj-divider>
        </mj-column>
      </mj-section>
      <mj-section padding-top="0px" padding-bottom="0px">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          <mj-image src="https://media.deloitte.com/is/image/deloitte/marketing_lead_100" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          </mj-image>
        </mj-column>
      </mj-section>`
  );


add(
    'MEM-SEE_banner',
    'MEM · SEE-banner',
    'MEM',
    `
    <mj-section padding-top="10px" padding-bottom="0px" background-color="#f5f5f5">
        <mj-column padding-top="0px" padding-bottom="0px">
          <mj-image src="https://media.deloitte.com/is/image/deloitte/SEE_Cluster_MEM_101" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          </mj-image>
        </mj-column>
      </mj-section>
      <mj-section padding-top="0px" padding-bottom="0px" background-color="#ffffff">
        <mj-column width="50%" padding-top="0px" padding-bottom="0px">
          <mj-button padding-right="10px" padding-left="10px" border-radius="0px 0 0 0" background-color="#ffffff" border="0px none black" href="https://bit.ly/3JZbG6j" font-size="14px" font-family="Aptos, Calibri, sans-serif">
            <span data-teams="true" style="color:#86bd40;font-weight:700;font-size:18px;text-decoration:underline;align:center;font-family:Aptos, Calibri, sans-serif;">HUN</span>
          </mj-button>
        </mj-column>
        <mj-column width="50%" padding-top="0px" padding-bottom="0px">
          <mj-button padding-right="10px" padding-left="10px" border-radius="0px 0 0 0" background-color="#ffffff" border="0px none black" href="https://bit.ly/44eM8sA" font-size="14px" font-family="Aptos, Calibri, sans-serif">
            <span data-teams="true" style="color:#86bd40;font-weight:700;font-size:18px;text-decoration:underline;align:center;font-family:Aptos, Calibri, sans-serif;">SOUTH</span>
          </mj-button>
        </mj-column>
      </mj-section>`
  );




 // ===== MDM template (examples) =====
  add(
    'Header with logo',
    'Header with logo',
    'MDM-template',
    `
  <mj-section padding-top="10px" padding-bottom="10px" text-align="left" background-color="#000000">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          <mj-image src="https://media.deloitte.com/is/image/deloitte/Logo_Deloitte_newsletter_MEM_101" padding-top="0px" padding-bottom="0px" align="left" width="170px">
          </mj-image>
        </mj-column>
      </mj-section>
      <mj-section padding-top="0px" padding-bottom="0px">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          <mj-text font-family="Aptos, Calibri, sans-serif" font-size="10px" color="#8f8f8f">Country | Industry | Month day, year | Internal Distribution Only
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section padding-top="0px" padding-bottom="0px" background-color="#007680">
        <mj-column padding-top="0px" padding-bottom="0px" padding-left="0px" padding-right="0px">
          <mj-raw>
            <a name="LINKTOP" id="LINKTOP"></a>
          </mj-raw>
          <mj-text padding-top="20px" padding-bottom="15px" font-size="28px" font-family="Aptos, Calibri, sans-serif" font-weight="700" color="#ffffff">Industry News
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section padding-top="10px" padding-bottom="0px">
        <mj-group>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Share_nav" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" href="#LINK1" target="_self" width="45px">
            </mj-image>
            <mj-text font-size="14px" align="center" font-family="Aptos, Calibri, sans-serif">Share with your clients
            </mj-text>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="5px" padding-left="5px">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Local_news_nav" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" href="#LINK2" target="_self" width="45px">
            </mj-image>
            <mj-text font-size="14px" align="center" font-family="Aptos, Calibri, sans-serif">Local
              <br/>News
            </mj-text>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="5px" padding-left="5px">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Global_nav_MDM" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" href="#LINK3" target="_self" width="45px">
            </mj-image>
            <mj-text font-size="14px" align="center" font-family="Aptos, Calibri, sans-serif">World 
              <br/>News 
            </mj-text>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="10px">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Events_nav_MDM" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" href="#LINK4" target="_self" width="45px">
            </mj-image>
            <mj-text font-size="14px" align="center" font-family="Aptos, Calibri, sans-serif">Events &amp; Webinars
            </mj-text>
          </mj-column>
        </mj-group>
      </mj-section>`
  );



  add(
    'Section-1',
    'Section 1',
    'MDM-template',
    `
 <mj-section padding-bottom="10px" background-color="#ffffff" padding-left="25px" padding-right="25px" text-align="left">
        <mj-group vertical-align="middle" width="100%">
          <mj-column vertical-align="middle" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="12%">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Share" padding-top="0px" padding-bottom="0px" padding-right="0px" align="left" width="50px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column vertical-align="middle" width="82%" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            <mj-raw>
              <a name="LINK1" id="LINK1"></a>
            </mj-raw>
            <mj-text padding-top="0px" font-family="Aptos, Calibri, sans-serif" font-size="30px" font-weight="700" padding-bottom="0px" padding-right="0px" padding-left="5px">Share with clients! 
            </mj-text>
          </mj-column>
        </mj-group>
      </mj-section>`
  );


    add(
    'Article-Section-1',
    'Article-Section 1',
    'MDM-template',
    `
 <mj-section padding-top="15px" padding-bottom="0px" background-color="#ffffff" padding-left="25px" padding-right="25px">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="100%">
          <mj-text font-family="Aptos, Calibri, sans-serif" padding-top="5px" padding-bottom="0px" font-size="12px" line-height="18px" color="#97999b" font-weight="700" padding-right="0px" padding-left="0px">Raport
          </mj-text>
          <mj-text font-size="24px" font-family="Aptos, Calibri, sans-serif" font-weight="700" padding-top="0px" padding-bottom="5px" line-height="28px" padding-right="0px" padding-left="0px">2026 financial services 
            <br/>industry outlooks
          </mj-text>
          <mj-text font-family="Aptos, Calibri, sans-serif" padding-top="0px" font-size="15px" line-height="18px" padding-right="0px" padding-left="0px">A guide to help you navigate what’s next and lead the industry forward in a time of extraordinary technological disruption, shifting customer expectations, regulatory complexity, and dynamic competition.
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section padding-top="0px" padding-bottom="0px" background-color="#ffffff" padding-left="25px" padding-right="25px">
        <mj-group width="100%">
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="30%">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Download_Report_MDM_100_2x" padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="30%">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Share_on_Linkedin_MDM_100_2x" padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="30%">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Share_on_Facebook_MDM_100_2x" padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px">
            </mj-image>
          </mj-column>
        </mj-group>
      </mj-section>`
  );
  
  


 add(
    'Section-2',
    'Section 2',
    'MDM-template',
    `
<mj-section padding-bottom="10px" background-color="#ffffff" padding-left="25px" padding-right="25px" text-align="left">
        <mj-group vertical-align="middle" width="100%">
          <mj-column vertical-align="middle" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="12%">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Local_MDM" padding-top="0px" padding-bottom="0px" padding-right="0px" align="left" width="50px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column vertical-align="middle" width="82%" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            <mj-raw>
              <a name="LINK2" id="LINK2"></a>
            </mj-raw>
            <mj-text padding-top="0px" font-family="Aptos, Calibri, sans-serif" font-size="30px" font-weight="700" padding-bottom="0px" padding-right="0px" padding-left="5px">Local News 
            </mj-text>
          </mj-column>
        </mj-group>
      </mj-section>`
  );



   add(
    'Article-Section-2',
    'Article-Section 2',
    'MDM-template',
    `
<mj-section padding-top="10px" padding-bottom="0px" background-color="#ffffff" padding-left="25px" padding-right="25px">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="100%">
          <mj-text font-size="15px" font-family="Aptos, Calibri, sans-serif" font-weight="700" padding-top="5px" padding-bottom="5px" line-height="17px" padding-right="0px" padding-left="0px">Fatih Birol, Executive Director, International Energy Agency: Romania is one of the few countries that relies on its gas. Developing nuclear energy is equally important, but the partner matters. Economies that have energy are the first in the AI race. If you wa
          </mj-text>
          <mj-text font-family="Aptos, Calibri, sans-serif" padding-top="5px" padding-bottom="5px" font-size="15px" line-height="18px" padding-right="0px" padding-left="0px">A guide to help you navigate what’s next and lead the industry forward in a time of extraordinary technological disruption, shifting customer expectations, regulatory complexity, and dynamic competition.
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section padding-top="0px" padding-bottom="0px" background-color="#ffffff" padding-left="25px" padding-right="25px">
        <mj-group width="100%">
          <mj-column padding-top="10px" padding-right="0px" padding-bottom="0px" padding-left="0px" width="30%">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Rea_the_article_1_MDM_100_2x" padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px">
            </mj-image>
          </mj-column>
        </mj-group>
      </mj-section>
      <mj-section padding-bottom="0px" background-color="#ffffff" padding-left="25px" padding-right="25px" padding-top="0px">
        <mj-column vertical-align="middle" padding-top="20px" padding-bottom="5px" padding-right="0px" padding-left="0px" width="100%">
          <mj-spacer height="3px" container-background-color="#f5f5f5">
          </mj-spacer>
        </mj-column>
      </mj-section>`
  );



add(
    'Section-3',
    'Section 3',
    'MDM-template',
    `
<mj-section padding-bottom="10px" background-color="#ffffff" padding-left="25px" padding-right="25px" text-align="left">
        <mj-group vertical-align="middle" width="100%">
          <mj-column vertical-align="middle" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="12%">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Global_MDM" padding-top="0px" padding-bottom="0px" padding-right="0px" align="left" width="50px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column vertical-align="middle" width="82%" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            <mj-raw>
              <a name="LINK3" id="LINK3"></a>
            </mj-raw>
            <mj-text padding-top="0px" font-family="Aptos, Calibri, sans-serif" font-size="30px" font-weight="700" padding-bottom="0px" padding-right="0px" padding-left="5px">World News 
            </mj-text>
          </mj-column>
        </mj-group>
      </mj-section>`
  );


add(
    'Article-Section-3',
    'Article-Section 3',
    'MDM-template',
    `
<mj-section padding-top="10px" padding-bottom="0px" background-color="#ffffff" padding-left="25px" padding-right="25px" text-align="left">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="100%">
          <mj-text font-size="15px" font-family="Aptos, Calibri, sans-serif" font-weight="700" padding-top="5px" padding-bottom="5px" line-height="17px" padding-right="0px" padding-left="0px">Fatih Birol, Executive Director, International Energy Agency: Romania is one of the few countries that relies on its gas. Developing nuclear energy is equally important, but the partner matters. Economies that have energy are the first in the AI race. If you wa
          </mj-text>
          <mj-text font-family="Aptos, Calibri, sans-serif" padding-top="5px" padding-bottom="5px" font-size="15px" line-height="18px" padding-right="0px" padding-left="0px">A guide to help you navigate what’s next and lead the industry forward in a time of extraordinary technological disruption, shifting customer expectations, regulatory complexity, and dynamic competition.
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section padding-top="0px" padding-bottom="0px" background-color="#ffffff" padding-left="25px" padding-right="25px" text-align="left">
        <mj-group width="100%">
          <mj-column padding-top="10px" padding-right="0px" padding-bottom="0px" padding-left="0px" width="30%">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Read_the_article_2_MDM_100_2x" padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px">
            </mj-image>
          </mj-column>
        </mj-group>
      </mj-section>
      <mj-section padding-top="10px" padding-bottom="0px" background-color="#ffffff" padding-left="25px" padding-right="25px" text-align="left">
        <mj-column vertical-align="middle" padding-top="20px" padding-bottom="5px" padding-right="0px" padding-left="0px" width="100%">
          <mj-spacer height="3px" container-background-color="#f5f5f5">
          </mj-spacer>
        </mj-column>
      </mj-section>`
  );


add(
    'Section-4',
    'Section 4',
    'MDM-template',
    `
<mj-section padding-bottom="10px" background-color="#ffffff" padding-left="25px" padding-right="25px" text-align="left">
        <mj-group vertical-align="middle" width="100%">
          <mj-column vertical-align="middle" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="12%">
            <mj-image src="https://media.deloitte.com/is/image/deloitte/Events_MDM" padding-top="0px" padding-bottom="0px" padding-right="0px" align="left" width="50px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column vertical-align="middle" width="82%" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            <mj-raw>
              <a name="LINK4" id="LINK4"></a>
            </mj-raw>
            <mj-text padding-top="0px" font-family="Aptos, Calibri, sans-serif" font-size="30px" font-weight="700" padding-bottom="0px" padding-right="0px" padding-left="5px">Events &amp; Webinars 
            </mj-text>
          </mj-column>
        </mj-group>
      </mj-section>`
  );

  

add(
    'Article-Section-4',
    'Article-Section 4',
    'MDM-template',
    `
<mj-section padding-top="10px" padding-bottom="0px" background-color="#ffffff">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="30px" padding-left="30px">
          <mj-text font-size="15px" font-family="Aptos, Calibri, sans-serif" font-weight="700" line-height="17px" container-background-color="#e1e1e1">November 15
          </mj-text>
          <mj-text font-family="Aptos, Calibri, sans-serif" padding-top="5px" padding-bottom="5px" font-size="15px" line-height="18px" font-weight="700"> sdasasadsdasadsadsa 
          </mj-text>
          <mj-text font-family="Aptos, Calibri, sans-serif" padding-top="5px" padding-bottom="5px" font-size="15px" line-height="18px" font-weight="700">Ora: 20:00 
          </mj-text>
          <mj-text font-size="15px" font-family="Aptos, Calibri, sans-serif" font-weight="700" line-height="17px" container-background-color="#e1e1e1">November 16
          </mj-text>
          <mj-text font-family="Aptos, Calibri, sans-serif" padding-top="5px" padding-bottom="5px" font-size="15px" line-height="18px" font-weight="700"> sdasasadsdasadsadsa 
          </mj-text>
          <mj-text font-family="Aptos, Calibri, sans-serif" padding-top="5px" padding-bottom="5px" font-size="15px" line-height="18px" font-weight="700">Ora: 20:00 
          </mj-text>
        </mj-column>
      </mj-section>`
  );


add(
    'Go-to-top',
    'Go-to-top',
    'MDM-template',
    `
  <mj-section padding-right="25px" text-align="right" background-color="#ffffff" padding-bottom="10px">
        <mj-column width="20%" vertical-align="middle" padding-top="0px" padding-bottom="0px" padding-left="0px" padding-right="0px">
          <mj-image src="https://media.deloitte.com/is/image/deloitte/Buton_Back_to_top" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" align="right" href="#LINKTOP" target="_self">
          </mj-image>
        </mj-column>
      </mj-section>`
  );


add(
    'Banner-1 MDM',
    'Banner-1 MDM',
    'MDM-template',
    `
  <mj-section padding-top="10px" padding-bottom="10px">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          <mj-image src="https://media.deloitte.com/is/image/deloitte/Banner_newsletter_MDM" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          </mj-image>
        </mj-column>
      </mj-section>`
  );


add(
    'Banner-Industry knowledge MDM',
    'Banner-Industry knowledge MDM',
    'MDM-template',
    `
  <mj-section padding-top="10px" padding-bottom="10px">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          <mj-image src="https://media.deloitte.com/is/image/deloitte/Banner_Industry%20Knowledge%20skills" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          </mj-image>
        </mj-column>
      </mj-section>`
  );



  
add(
    '3 Button general MDM',
    '3 Button general MDM',
    'MDM-template',
    `
   <mj-section padding-top="0px" padding-bottom="0px" background-color="#ffffff" padding-right="25px">
        <mj-group width="100%">
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="30%">
            <mj-button border-radius="0px 0px 0px 0px" font-size="14px" font-weight="700" color="#5e35bd" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" font-family="Aptos, Calibri, sans-serif" background-color="#ffffff" text-decoration="underline" align="left">Scrie Aici
            </mj-button>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="30%">
            <mj-button border-radius="0px 0px 0px 0px" font-size="14px" font-weight="700" color="#5e35bd" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" font-family="Aptos, Calibri, sans-serif" background-color="#ffffff" text-decoration="underline" align="left">Scrie Aici
            </mj-button>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="30%">
            <mj-button border-radius="0px 0px 0px 0px" font-size="14px" font-weight="700" color="#5e35bd" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" font-family="Aptos, Calibri, sans-serif" background-color="#ffffff" text-decoration="underline" align="left">Scrie Aici
            </mj-button>
          </mj-column>
        </mj-group>
      </mj-section>`
  );


add(
    '1 Button general MDM',
    '1 Button general MDM',
    'MDM-template',
    `
     <mj-section padding-top="0px" padding-bottom="0px" background-color="#ffffff" padding-right="25px">        
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="100%">
            <mj-button border-radius="0px 0px 0px 0px" font-size="14px" font-weight="700" color="#5e35bd" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" font-family="Aptos, Calibri, sans-serif" background-color="#ffffff" text-decoration="underline" text-align="left">Scrie Aici dsadsada sadadsadsad sdadsadsadsa sdadsadasd sdadsada sadsadsad sdsadadad sdadsad
            </mj-button>
          </mj-column>        
      </mj-section>`
  );



add(
    'test Header with logo mobile',
    'test Header with logo',
    'MDM-template',
    `
  <mj-section padding-top="10px" padding-bottom="10px" text-align="left" background-color="#000000">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          <mj-image src="https://media.deloitte.com/is/image/deloitte/Logo_Deloitte_newsletter_MEM_101" padding-top="0px" padding-bottom="0px" align="left" width="170px">
          </mj-image>
        </mj-column>
      </mj-section>
      <mj-section padding-top="0px" padding-bottom="0px">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
          <mj-text font-family="Aptos, Calibri, sans-serif" font-size="10px" color="#8f8f8f">Country | Industry | Month day, year | Internal Distribution Only
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section padding-top="0px" padding-bottom="0px" background-color="#007680">
        <mj-column padding-top="0px" padding-bottom="0px" padding-left="0px" padding-right="0px">
          <mj-raw>
            <a name="LINKTOP" id="LINKTOP"></a>
          </mj-raw>
          <mj-text padding-top="20px" padding-bottom="15px" font-size="28px" font-family="Aptos, Calibri, sans-serif" font-weight="700" color="#ffffff">Industry News
          </mj-text>
        </mj-column>
      </mj-section>
    <mj-section padding-top="10px" padding-bottom="0px">
  <mj-column padding="0">
    <mj-raw>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center" valign="top" style="width:25%; padding:0 10px 10px 0;">
            <a href="#LINK1" target="_self" style="text-decoration:none; color:#000000;">
              <img src="https://media.deloitte.com/is/image/deloitte/Share_nav" width="45" border="0" style="display:block; margin:0 auto;" alt="">
              <div style="font-family:Aptos, Calibri, sans-serif; font-size:14px; line-height:18px; text-align:center; padding-top:8px;">
                Share with your clients
              </div>
            </a>
          </td>
          <td align="center" valign="top" style="width:25%; padding:0 5px 10px 5px;">
            <a href="#LINK2" target="_self" style="text-decoration:none; color:#000000;">
              <img src="https://media.deloitte.com/is/image/deloitte/Local_news_nav" width="45" border="0" style="display:block; margin:0 auto;" alt="">
              <div style="font-family:Aptos, Calibri, sans-serif; font-size:14px; line-height:18px; text-align:center; padding-top:8px;">
                Local News
              </div>
            </a>
          </td>
          <td align="center" valign="top" style="width:25%; padding:0 5px 10px 5px;">
            <a href="#LINK3" target="_self" style="text-decoration:none; color:#000000;">
              <img src="https://media.deloitte.com/is/image/deloitte/Global_nav_MDM" width="45" border="0" style="display:block; margin:0 auto;" alt="">
              <div style="font-family:Aptos, Calibri, sans-serif; font-size:14px; line-height:18px; text-align:center; padding-top:8px;">
                World News
              </div>
            </a>
          </td>
          <td align="center" valign="top" style="width:25%; padding:0 0 10px 10px;">
            <a href="#LINK4" target="_self" style="text-decoration:none; color:#000000;">
              <img src="https://media.deloitte.com/is/image/deloitte/Events_nav_MDM" width="45" border="0" style="display:block; margin:0 auto;" alt="">
              <div style="font-family:Aptos, Calibri, sans-serif; font-size:14px; line-height:18px; text-align:center; padding-top:8px;">
                Events &amp; Webinars
              </div>
            </a>
          </td>
        </tr>
      </table>
    </mj-raw>
  </mj-column>
</mj-section>`
  );

  


  

  

  
  
  // ===== ERDC (examples) =====
  add(
    'erdc-cta',
    'ERDC · Full-width CTA',
    'ERDC',
    `
<mj-section background-color="#111827" padding="24px">
  <mj-column>
    <mj-text color="#ffffff" font-size="18px" font-weight="700">Don’t miss out</mj-text>
    <mj-text color="#D1D5DB">Short supporting sentence.</mj-text>
    <mj-button href="#" background-color="#2563EB" color="#ffffff">Call to action</mj-button>
  </mj-column>
</mj-section>`
  );
}
