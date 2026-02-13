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
          <mj-text padding-top="20px" padding-bottom="15px" font-size="28px" font-family="Aptos, Calibri, sans-serif" font-weight="700" color="#ffffff">Industry News
          </mj-text>
        </mj-column>
      </mj-section>
      <mj-section padding-top="10px" padding-bottom="0px">
        <mj-group>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px">
            <mj-image src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSI0MCIgaWQ9InNjcmVlbnNob3QtNjg4ODk0NWItYTMzOC04MGU1LTgwMDctMzU2MWRmZDkyYjQxIiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBmaWxsPSJub25lIiB2ZXJzaW9uPSIxLjEiPjxnIGlkPSJzaGFwZS02ODg4OTQ1Yi1hMzM4LTgwZTUtODAwNy0zNTYxZGZkOTJiNDEiPjxnIGNsYXNzPSJmcmFtZS1jb250YWluZXItd3JhcHBlciI+PGcgY2xhc3M9ImZyYW1lLWNvbnRhaW5lci1ibHVyIj48ZyBjbGFzcz0iZnJhbWUtY29udGFpbmVyLXNoYWRvd3MiPjxnIGZpbGw9Im5vbmUiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTY4ODg5NDViLWEzMzgtODBlNS04MDA3LTM1NjFkZmQ5MmI0MSI+PHJlY3Qgcng9IjAiIHJ5PSIwIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBjbGFzcz0iZnJhbWUtYmFja2dyb3VuZCIvPjwvZz48ZyBjbGFzcz0iZnJhbWUtY2hpbGRyZW4iPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTY1N2FkMTMwMWIiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTZiZTE3MDhjLWY0MzQtODA3Ny04MDA3LTM1NjU3YWQxMzAxYiI+PHBhdGggZD0iTTIwLDBDOS4wMDAyNDQxNDA2MjUsMCwwLDguOTk5OTY5NDgyNDIxODc1LDAsMTkuOTk5OTM4OTY0ODQzNzVDMCwzMS4wMDAwMzA1MTc1NzgxMjUsOS4wMDAyNDQxNDA2MjUsNDAuMDAwMDYxMDM1MTU2MjUsMjAsNDAuMDAwMDYxMDM1MTU2MjVDMzAuOTk5NzU1ODU5Mzc1LDQwLjAwMDA2MTAzNTE1NjI1LDQwLDMxLjAwMDAzMDUxNzU3ODEyNSw0MCwxOS45OTk5Mzg5NjQ4NDM3NUM0MCw4Ljk5OTk2OTQ4MjQyMTg3NSwzMC45OTk3NTU4NTkzNzUsMCwyMCwwTTI0LjAwMDI0NDE0MDYyNSwyNy45OTk5MDg0NDcyNjU2MjVMMjQuMDAwMjQ0MTQwNjI1LDIyLjAwMDA5MTU1MjczNDM3NUMxNi43ODAwMjkyOTY4NzUsMjIuMDAwMDkxNTUyNzM0Mzc1LDExLjYxOTg3MzA0Njg3NSwyNC44NjAwNDYzODY3MTg3NSw3Ljk5OTc1NTg1OTM3NSwzMEM5LjQzOTY5NzI2NTYyNSwyMi42NjAwNjQ2OTcyNjU2MjUsMTMuODgwMTI2OTUzMTI1LDE1LjQ1OTkzMDQxOTkyMTg3NSwyNC4wMDAyNDQxNDA2MjUsMTMuOTk5OTY5NDgyNDIxODc1TDI0LjAwMDI0NDE0MDYyNSw3Ljk5OTkwODQ0NzI2NTYyNUwzNC4wMDAyNDQxNDA2MjUsMTcuOTk5OTA4NDQ3MjY1NjI1WiIgc3R5bGU9ImZpbGw6IHJnYigxNTEsIDE1MywgMTU1KTsgZmlsbC1vcGFjaXR5OiAxOyIvPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9zdmc+" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" href="#LINK1" target="_self" width="45px">
            </mj-image>
            <mj-text font-size="14px" align="center" font-family="Aptos, Calibri, sans-serif">Share with your clients
            </mj-text>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="5px" padding-left="5px">
            <mj-image src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSI0MCIgaWQ9InNjcmVlbnNob3QtNmJlMTcwOGMtZjQzNC04MDc3LTgwMDctMzU2NTJjYzQxMzEyIiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBmaWxsPSJub25lIiB2ZXJzaW9uPSIxLjEiPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTY1MmNjNDEzMTIiPjxnIGNsYXNzPSJmcmFtZS1jb250YWluZXItd3JhcHBlciI+PGcgY2xhc3M9ImZyYW1lLWNvbnRhaW5lci1ibHVyIj48ZyBjbGFzcz0iZnJhbWUtY29udGFpbmVyLXNoYWRvd3MiPjxnIGZpbGw9Im5vbmUiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTZiZTE3MDhjLWY0MzQtODA3Ny04MDA3LTM1NjUyY2M0MTMxMiI+PHJlY3Qgcng9IjAiIHJ5PSIwIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBjbGFzcz0iZnJhbWUtYmFja2dyb3VuZCIvPjwvZz48ZyBjbGFzcz0iZnJhbWUtY2hpbGRyZW4iPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTZiNzA0MGQ4NjUiIHJ4PSIwIiByeT0iMCI+PGcgaWQ9InNoYXBlLTZiZTE3MDhjLWY0MzQtODA3Ny04MDA3LTM1NmI3MDQwZDg2NiI+PGcgY2xhc3M9ImZpbGxzIiBpZD0iZmlsbHMtNmJlMTcwOGMtZjQzNC04MDc3LTgwMDctMzU2YjcwNDBkODY2Ij48ZWxsaXBzZSBjeD0iMjAiIGN5PSIyMCIgcng9IjIwIiByeT0iMjAiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBzdHlsZT0iZmlsbDogcmdiKDE1MSwgMTUzLCAxNTUpOyBmaWxsLW9wYWNpdHk6IDE7Ii8+PC9nPjwvZz48ZyBpZD0ic2hhcGUtNmJlMTcwOGMtZjQzNC04MDc3LTgwMDctMzU2YjcwNDBkODY3IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSIwIiByeT0iMCIgc3R5bGU9ImZpbGw6IHJnYigwLCAwLCAwKTsiPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTZiNzA0MGQ4NjgiIHN0eWxlPSJkaXNwbGF5OiBub25lOyI+PGcgY2xhc3M9ImZpbGxzIiBpZD0iZmlsbHMtNmJlMTcwOGMtZjQzNC04MDc3LTgwMDctMzU2YjcwNDBkODY4Ij48cmVjdCB3aWR0aD0iMjUuOTk5OTk5OTk5OTk5NzczIiBoZWlnaHQ9IjI2IiB4PSI3IiB0cmFuc2Zvcm09Im1hdHJpeCgxLjAwMDAwMCwgMC4wMDAwMDAsIDAuMDAwMDAwLCAxLjAwMDAwMCwgMC4wMDAwMDAsIDAuMDAwMDAwKSIgc3R5bGU9ImZpbGw6IG5vbmU7IiByeT0iMCIgZmlsbD0ibm9uZSIgcng9IjAiIHk9IjciLz48L2c+PC9nPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTZiNzA0MGQ4NjkiIHJ4PSIwIiByeT0iMCIgc3R5bGU9ImZpbGw6IHJnYigwLCAwLCAwKTsiPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTZiNzA0MGQ4NmEiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTZiZTE3MDhjLWY0MzQtODA3Ny04MDA3LTM1NmI3MDQwZDg2YSI+PHBhdGggZD0iTTIwLjY0MjU3ODEyNSwzMi4xOTYxMzY0NzQ2MDkzNzVMMjAuNjMwNjE1MjM0Mzc1LDMyLjE5ODM5NDc3NTM5MDYyNUwyMC41NTM3MTA5Mzc1LDMyLjIzNjIwNjA1NDY4NzVMMjAuNTMxOTgyNDIxODc1LDMyLjI0MDU3MDA2ODM1OTM3NUwyMC41MTY4NDU3MDMxMjUsMzIuMjM2MjA2MDU0Njg3NUwyMC40Mzk2OTcyNjU2MjUsMzIuMTk4Mzk0Nzc1MzkwNjI1QzIwLjQyODIyMjY1NjI1LDMyLjE5NDczMjY2NjAxNTYyNSwyMC40MTk2Nzc3MzQzNzUsMzIuMTk2NTMzMjAzMTI1LDIwLjQxMzgxODM1OTM3NSwzMi4yMDM3NjU4NjkxNDA2MjVMMjAuNDA5NDIzODI4MTI1LDMyLjIxNDU5OTYwOTM3NUwyMC4zOTExMTMyODEyNSwzMi42NzgyNTMxNzM4MjgxMjVMMjAuMzk2NDg0Mzc1LDMyLjY5OTk1MTE3MTg3NUwyMC40MDcyMjY1NjI1LDMyLjcxMzk4OTI1NzgxMjVMMjAuNTIwMDE5NTMxMjUsMzIuNzk0MTg5NDUzMTI1TDIwLjUzNjM3Njk1MzEyNSwzMi43OTg0OTI0MzE2NDA2MjVMMjAuNTQ5MzE2NDA2MjUsMzIuNzk0MTg5NDUzMTI1TDIwLjY2MTg2NTIzNDM3NSwzMi43MTM5ODkyNTc4MTI1TDIwLjY3NTA0ODgyODEyNSwzMi42OTY2ODU3OTEwMTU2MjVMMjAuNjc5MTk5MjE4NzUsMzIuNjc4MjUzMTczODI4MTI1TDIwLjY2MDg4ODY3MTg3NSwzMi4yMTU2Njc3MjQ2MDkzNzVDMjAuNjU3OTU4OTg0Mzc1LDMyLjIwNDA3MTA0NDkyMTg3NSwyMC42NTE4NTU0Njg3NSwzMi4xOTc2MDEzMTgzNTkzNzUsMjAuNjQyNTc4MTI1LDMyLjE5NjEzNjQ3NDYwOTM3NU0yMC45Mjk0NDMzNTkzNzUsMzIuMDczNzYwOTg2MzI4MTI1TDIwLjkxNTUyNzM0Mzc1LDMyLjA3NTg5NzIxNjc5Njg3NUwyMC43MTUwODc4OTA2MjUsMzIuMTc2NjA1MjI0NjA5Mzc1TDIwLjcwNDEwMTU2MjUsMzIuMTg3NUwyMC43MDA5Mjc3MzQzNzUsMzIuMTk5NDYyODkwNjI1TDIwLjcyMDQ1ODk4NDM3NSwzMi42NjUxOTE2NTAzOTA2MjVMMjAuNzI1ODMwMDc4MTI1LDMyLjY3ODI1MzE3MzgyODEyNUwyMC43MzQ2MTkxNDA2MjUsMzIuNjg1ODIxNTMzMjAzMTI1TDIwLjk1MjM5MjU3ODEyNSwzMi43ODY2MjEwOTM3NUMyMC45NjYwNjQ0NTMxMjUsMzIuNzkwMTYxMTMyODEyNSwyMC45NzYzMTgzNTkzNzUsMzIuNzg3MzIyOTk4MDQ2ODc1LDIwLjk4MzY0MjU3ODEyNSwzMi43Nzc4NjI1NDg4MjgxMjVMMjAuOTg4MDM3MTA5Mzc1LDMyLjc2MjY5NTMxMjVMMjAuOTUxMTcxODc1LDMyLjA5NzU2NDY5NzI2NTYyNUMyMC45NDc1MDk3NjU2MjUsMzIuMDg0NTY0MjA4OTg0Mzc1LDIwLjk0MDQyOTY4NzUsMzIuMDc2NTY4NjAzNTE1NjI1LDIwLjkyOTQ0MzM1OTM3NSwzMi4wNzM3NjA5ODYzMjgxMjVNMjAuMTU1MDI5Mjk2ODc1LDMyLjA3NTg5NzIxNjc5Njg3NUMyMC4xNDUwMTk1MzEyNSwzMi4wNjk5NDYyODkwNjI1LDIwLjEzMjA4MDA3ODEyNSwzMi4wNzI3NTM5MDYyNSwyMC4xMjU3MzI0MjE4NzUsMzIuMDgyMzk3NDYwOTM3NUwyMC4xMTkxNDA2MjUsMzIuMDk3NTY0Njk3MjY1NjI1TDIwLjA4MjI3NTM5MDYyNSwzMi43NjI2OTUzMTI1QzIwLjA4MzAwNzgxMjUsMzIuNzc1NzI2MzE4MzU5Mzc1LDIwLjA4OTExMTMyODEyNSwzMi43ODQ1MTUzODA4NTkzNzUsMjAuMTAwODMwMDc4MTI1LDMyLjc4ODc4Nzg0MTc5Njg3NUwyMC4xMTY5NDMzNTkzNzUsMzIuNzg2NjIxMDkzNzVMMjAuMzM0NzE2Nzk2ODc1LDMyLjY4NTgyMTUzMzIwMzEyNUwyMC4zNDU0NTg5ODQzNzUsMzIuNjc3MjE1NTc2MTcxODc1TDIwLjM0OTg1MzUxNTYyNSwzMi42NjUxOTE2NTAzOTA2MjVMMjAuMzY4NDA4MjAzMTI1LDMyLjE5OTQ2Mjg5MDYyNUwyMC4zNjQ5OTAyMzQzNzUsMzIuMTg2NDMxODg0NzY1NjI1TDIwLjM1NDI0ODA0Njg3NSwzMi4xNzU1MzcxMDkzNzVaIiBmaWxsPSJub25lIiBzdHlsZT0iZmlsbDogbm9uZTsiLz48L2c+PC9nPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTZiNzA0MGQ4NmIiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTZiZTE3MDhjLWY0MzQtODA3Ny04MDA3LTM1NmI3MDQwZDg2YiI+PHBhdGggZD0iTTI0LjMzMzI1MTk1MzEyNSwxMC4yNUMyNS40NjcwNDEwMTU2MjUsMTAuMjQ5NjMzNzg5MDYyNSwyNi40MDk0MjM4MjgxMjUsMTEuMTIzNTA0NjM4NjcxODc1LDI2LjQ5NDYyODkwNjI1LDEyLjI1NDE1MDM5MDYyNUwyNi41LDEyLjQxNjY1NjQ5NDE0MDYyNUwyNi41LDE3LjgzMzM0MzUwNTg1OTM3NUwyOC4xMjUsMTcuODMzMzQzNTA1ODU5Mzc1QzI4Ljk2MTkxNDA2MjUsMTcuODMzMzc0MDIzNDM3NSwyOS42NjIxMDkzNzUsMTguNDY5MjA3NzYzNjcxODc1LDI5Ljc0MjQzMTY0MDYyNSwxOS4zMDIzMzc2NDY0ODQzNzVMMjkuNzUsMTkuNDU4MzQzNTA1ODU5Mzc1TDI5Ljc1LDI3LjU4MzM0MzUwNTg1OTM3NUMyOS43NSwyOS4zMDQyMjk3MzYzMjgxMjUsMjguNDA4NjkxNDA2MjUsMzAuNzI2OTU5MjI4NTE1NjI1LDI2LjY5MDY3MzgyODEyNSwzMC44Mjc5MTEzNzY5NTMxMjVMMjYuNSwzMC44MzMzNDM1MDU4NTkzNzVMMTIuNDE2NzQ4MDQ2ODc1LDMwLjgzMzM0MzUwNTg1OTM3NUMxMS4yODI5NTg5ODQzNzUsMzAuODMzNzA5NzE2Nzk2ODc1LDEwLjM0MDU3NjE3MTg3NSwyOS45NTk4Mzg4NjcxODc1LDEwLjI1NTM3MTA5Mzc1LDI4LjgyOTE5MzExNTIzNDM3NUwxMC4yNSwyOC42NjY2NTY0OTQxNDA2MjVMMTAuMjUsMTIuNDE2NjU2NDk0MTQwNjI1QzEwLjI0OTc1NTg1OTM3NSwxMS4yODI4Njc0MzE2NDA2MjUsMTEuMTIzNTM1MTU2MjUsMTAuMzQwNDU0MTAxNTYyNSwxMi4yNTQxNTAzOTA2MjUsMTAuMjU1NDAxNjExMzI4MTI1TDEyLjQxNjc0ODA0Njg3NSwxMC4yNVpNMjcuNTgzMjUxOTUzMTI1LDIwTDI2LjUsMjBMMjYuNSwyOC42NjY2NTY0OTQxNDA2MjVDMjcuMDk4Mzg4NjcxODc1LDI4LjY2NjY1NjQ5NDE0MDYyNSwyNy41ODMyNTE5NTMxMjUsMjguMTgxNjQwNjI1LDI3LjU4MzI1MTk1MzEyNSwyNy41ODMzNDM1MDU4NTkzNzVaTTE4LjkxNjc0ODA0Njg3NSwyMS4wODMzNDM1MDU4NTkzNzVMMTUuNjY2NzQ4MDQ2ODc1LDIxLjA4MzM0MzUwNTg1OTM3NUMxNS4wOTM1MDU4NTkzNzUsMjEuMDgzOTg0Mzc1LDE0LjYxOTg3MzA0Njg3NSwyMS41MzA5NzUzNDE3OTY4NzUsMTQuNTg2NDI1NzgxMjUsMjIuMTAzMTc5OTMxNjQwNjI1QzE0LjU1MjczNDM3NSwyMi42NzU0MTUwMzkwNjI1LDE0Ljk3MDcwMzEyNSwyMy4xNzQ3MTMxMzQ3NjU2MjUsMTUuNTM5Nzk0OTIxODc1LDIzLjI0MjQzMTY0MDYyNUwxNS42NjY3NDgwNDY4NzUsMjMuMjVMMTguOTE2NzQ4MDQ2ODc1LDIzLjI1QzE5LjQ4OTk5MDIzNDM3NSwyMy4yNDkzNTkxMzA4NTkzNzUsMTkuOTYzMzc4OTA2MjUsMjIuODAyMzY4MTY0MDYyNSwxOS45OTY4MjYxNzE4NzUsMjIuMjMwMTMzMDU2NjQwNjI1QzIwLjAzMDUxNzU3ODEyNSwyMS42NTc5Mjg0NjY3OTY4NzUsMTkuNjEyNTQ4ODI4MTI1LDIxLjE1ODU5OTg1MzUxNTYyNSwxOS4wNDM0NTcwMzEyNSwyMS4wOTA5MTE4NjUyMzQzNzVaTTIxLjA4MzI1MTk1MzEyNSwxNS42NjY2NTY0OTQxNDA2MjVMMTUuNjY2NzQ4MDQ2ODc1LDE1LjY2NjY1NjQ5NDE0MDYyNUMxNS4wNjgzNTkzNzUsMTUuNjY2NjU2NDk0MTQwNjI1LDE0LjU4MzI1MTk1MzEyNSwxNi4xNTE3MDI4ODA4NTkzNzUsMTQuNTgzMjUxOTUzMTI1LDE2Ljc1QzE0LjU4MzI1MTk1MzEyNSwxNy4zNDgyOTcxMTkxNDA2MjUsMTUuMDY4MzU5Mzc1LDE3LjgzMzM0MzUwNTg1OTM3NSwxNS42NjY3NDgwNDY4NzUsMTcuODMzMzQzNTA1ODU5Mzc1TDIxLjA4MzI1MTk1MzEyNSwxNy44MzMzNDM1MDU4NTkzNzVDMjEuNjgxNjQwNjI1LDE3LjgzMzM0MzUwNTg1OTM3NSwyMi4xNjY3NDgwNDY4NzUsMTcuMzQ4Mjk3MTE5MTQwNjI1LDIyLjE2Njc0ODA0Njg3NSwxNi43NUMyMi4xNjY3NDgwNDY4NzUsMTYuMTUxNzAyODgwODU5Mzc1LDIxLjY4MTY0MDYyNSwxNS42NjY2NTY0OTQxNDA2MjUsMjEuMDgzMjUxOTUzMTI1LDE1LjY2NjY1NjQ5NDE0MDYyNSIgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsgZmlsbC1vcGFjaXR5OiAxOyIvPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9zdmc+" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" href="#LINK2" target="_self" width="45px">
            </mj-image>
            <mj-text font-size="14px" align="center" font-family="Aptos, Calibri, sans-serif">Local
              <br/>News
            </mj-text>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="5px" padding-left="5px">
            <mj-image src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSI0MCIgaWQ9InNjcmVlbnNob3QtNmJlMTcwOGMtZjQzNC04MDc3LTgwMDctMzU2NTk4ZjgzMWEzIiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBmaWxsPSJub25lIiB2ZXJzaW9uPSIxLjEiPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTY1OThmODMxYTMiPjxnIGNsYXNzPSJmcmFtZS1jb250YWluZXItd3JhcHBlciI+PGcgY2xhc3M9ImZyYW1lLWNvbnRhaW5lci1ibHVyIj48ZyBjbGFzcz0iZnJhbWUtY29udGFpbmVyLXNoYWRvd3MiPjxnIGZpbGw9Im5vbmUiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTZiZTE3MDhjLWY0MzQtODA3Ny04MDA3LTM1NjU5OGY4MzFhMyI+PHJlY3Qgcng9IjAiIHJ5PSIwIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBjbGFzcz0iZnJhbWUtYmFja2dyb3VuZCIvPjwvZz48ZyBjbGFzcz0iZnJhbWUtY2hpbGRyZW4iPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTY1ZDdhZDkxMDEiIHJ4PSIwIiByeT0iMCI+PGcgaWQ9InNoYXBlLTZiZTE3MDhjLWY0MzQtODA3Ny04MDA3LTM1NjVkN2FkOTEwMiI+PGcgY2xhc3M9ImZpbGxzIiBpZD0iZmlsbHMtNmJlMTcwOGMtZjQzNC04MDc3LTgwMDctMzU2NWQ3YWQ5MTAyIj48ZWxsaXBzZSBjeD0iMjAiIGN5PSIyMCIgcng9IjIwIiByeT0iMjAiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBzdHlsZT0iZmlsbDogcmdiKDE1MSwgMTUzLCAxNTUpOyBmaWxsLW9wYWNpdHk6IDE7Ii8+PC9nPjwvZz48ZyBpZD0ic2hhcGUtNmJlMTcwOGMtZjQzNC04MDc3LTgwMDctMzU2NWQ3YWQ5MTAzIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSIwIiByeT0iMCIgc3R5bGU9ImZpbGw6IHJnYigwLCAwLCAwKTsiPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTY1ZDdhZDkxMDQiIHN0eWxlPSJkaXNwbGF5OiBub25lOyI+PGcgY2xhc3M9ImZpbGxzIiBpZD0iZmlsbHMtNmJlMTcwOGMtZjQzNC04MDc3LTgwMDctMzU2NWQ3YWQ5MTA0Ij48cmVjdCB3aWR0aD0iMzAiIGhlaWdodD0iMzAiIHg9IjUiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBmaWxsLW9wYWNpdHk6IDE7IiByeT0iMCIgZmlsbD0ibm9uZSIgcng9IjAiIHk9IjUiLz48L2c+PC9nPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTY1ZDdhZDkxMDUiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTZiZTE3MDhjLWY0MzQtODA3Ny04MDA3LTM1NjVkN2FkOTEwNSI+PHBhdGggZD0iTTIwLDMyLjVDMTguMjcwODc0MDIzNDM3NSwzMi41LDE2LjY0NTg3NDAyMzQzNzUsMzIuMTcxNjMwODU5Mzc1LDE1LjEyNSwzMS41MTQ5ODQxMzA4NTkzNzVDMTMuNjA0MjQ4MDQ2ODc1LDMwLjg1ODMwNjg4NDc2NTYyNSwxMi4yODEyNSwyOS45Njc4OTU1MDc4MTI1LDExLjE1NjM3MjA3MDMxMjUsMjguODQzNzVDMTAuMDMxMjUsMjcuNzE5NTczOTc0NjA5Mzc1LDkuMTQwODY5MTQwNjI1LDI2LjM5NjYzNjk2Mjg5MDYyNSw4LjQ4NDk4NTM1MTU2MjUsMjQuODc1MDMwNTE3NTc4MTI1QzcuODI5MTAxNTYyNSwyMy4zNTMzNjMwMzcxMDkzNzUsNy41MDA3MzI0MjE4NzUsMjEuNzI4MzYzMDM3MTA5Mzc1LDcuNSwyMEM3LjQ5OTI2NzU3ODEyNSwxOC4yNzE2MzY5NjI4OTA2MjUsNy44Mjc1MTQ2NDg0Mzc1LDE2LjY0NjYzNjk2Mjg5MDYyNSw4LjQ4NDk4NTM1MTU2MjUsMTUuMTI0OTY5NDgyNDIxODc1QzkuMTQyNDU2MDU0Njg3NSwxMy42MDMzNjMwMzcxMDkzNzUsMTAuMDMyOTU4OTg0Mzc1LDEyLjI4MDQyNjAyNTM5MDYyNSwxMS4xNTYzNzIwNzAzMTI1LDExLjE1NjI1QzEyLjI3OTU0MTAxNTYyNSwxMC4wMzIxMDQ0OTIxODc1LDEzLjYwMjUzOTA2MjUsOS4xNDE2OTMxMTUyMzQzNzUsMTUuMTI1LDguNDg1MDE1ODY5MTQwNjI1QzE2LjY0NzQ2MDkzNzUsNy44MjgzNjkxNDA2MjUsMTguMjcyNTgzMDA3ODEyNSw3LjUsMjAsNy41QzIxLjcyNzUzOTA2MjUsNy41LDIzLjM1MjUzOTA2MjUsNy44MjgzNjkxNDA2MjUsMjQuODc1LDguNDg1MDE1ODY5MTQwNjI1QzI2LjM5NzU4MzAwNzgxMjUsOS4xNDE2OTMxMTUyMzQzNzUsMjcuNzIwNDU4OTg0Mzc1LDEwLjAzMjEwNDQ5MjE4NzUsMjguODQzNzUsMTEuMTU2MjVDMjkuOTY3MDQxMDE1NjI1LDEyLjI4MDQyNjAyNTM5MDYyNSwzMC44NTc5MTAxNTYyNSwxMy42MDMzNjMwMzcxMDkzNzUsMzEuNTE2MzU3NDIxODc1LDE1LjEyNDk2OTQ4MjQyMTg3NUMzMi4xNzQ1NjA1NDY4NzUsMTYuNjQ2NjM2OTYyODkwNjI1LDMyLjUwMjQ0MTQwNjI1LDE4LjI3MTYzNjk2Mjg5MDYyNSwzMi41LDIwQzMyLjQ5NzU1ODU5Mzc1LDIxLjcyODM2MzAzNzEwOTM3NSwzMi4xNjkxODk0NTMxMjUsMjMuMzUzMzYzMDM3MTA5Mzc1LDMxLjUxNTEzNjcxODc1LDI0Ljg3NTAzMDUxNzU3ODEyNUMzMC44NjA5NjE5MTQwNjI1LDI2LjM5NjYzNjk2Mjg5MDYyNSwyOS45NzA0NTg5ODQzNzUsMjcuNzE5NTczOTc0NjA5Mzc1LDI4Ljg0Mzc1LDI4Ljg0Mzc1QzI3LjcxNzE2MzA4NTkzNzUsMjkuOTY3ODk1NTA3ODEyNSwyNi4zOTQyODcxMDkzNzUsMzAuODU4NzY0NjQ4NDM3NSwyNC44NzUsMzEuNTE2MjY1ODY5MTQwNjI1QzIzLjM1NTk1NzAzMTI1LDMyLjE3MzczNjU3MjI2NTYyNSwyMS43MzA4MzQ5NjA5Mzc1LDMyLjUwMTY3ODQ2Njc5Njg3NSwyMCwzMi41TTIwLDMwQzIyLjc5MTYyNTk3NjU2MjUsMzAsMjUuMTU2MjUsMjkuMDMxMjE5NDgyNDIxODc1LDI3LjA5Mzg3MjA3MDMxMjUsMjcuMDkzNzVDMjkuMDMxMjUsMjUuMTU2MjUsMzAsMjIuNzkxNjU2NDk0MTQwNjI1LDMwLDIwQzMwLDE5Ljg1NDIxNzUyOTI5Njg3NSwyOS45OTQ5OTUxMTcxODc1LDE5LjcwMjkxMTM3Njk1MzEyNSwyOS45ODUxMDc0MjE4NzUsMTkuNTQ2MjY0NjQ4NDM3NUMyOS45NzQ5NzU1ODU5Mzc1LDE5LjM4OTU1Njg4NDc2NTYyNSwyOS45Njk3MjY1NjI1LDE5LjI1OTU1MjAwMTk1MzEyNSwyOS45Njg3NSwxOS4xNTYyNUMyOS44NjQ3NDYwOTM3NSwxOS43NjA0MDY0OTQxNDA2MjUsMjkuNTgzMjUxOTUzMTI1LDIwLjI2MDM3NTk3NjU2MjUsMjkuMTI1MTIyMDcwMzEyNSwyMC42NTYyODA1MTc1NzgxMjVDMjguNjY2NzQ4MDQ2ODc1LDIxLjA1MjA5MzUwNTg1OTM3NSwyOC4xMjUsMjEuMjUsMjcuNSwyMS4yNUwyNSwyMS4yNUMyNC4zMTI1LDIxLjI1LDIzLjcyNDI0MzE2NDA2MjUsMjEuMDA1NDAxNjExMzI4MTI1LDIzLjIzNTEwNzQyMTg3NSwyMC41MTYyNjU4NjkxNDA2MjVDMjIuNzQ1ODQ5NjA5Mzc1LDIwLjAyNzA5OTYwOTM3NSwyMi41MDA3MzI0MjE4NzUsMTkuNDM4MzIzOTc0NjA5Mzc1LDIyLjUsMTguNzVMMjIuNSwxNy41TDE3LjUsMTcuNUwxNy41LDE1QzE3LjUsMTQuMzEyNSwxNy43NDUxMTcxODc1LDEzLjcyNDEyMTA5Mzc1LDE4LjIzNTEwNzQyMTg3NSwxMy4yMzUwMTU4NjkxNDA2MjVDMTguNzI0OTc1NTg1OTM3NSwxMi43NDU4MTkwOTE3OTY4NzUsMTkuMzEzMzU0NDkyMTg3NSwxMi41MDA4NTQ0OTIxODc1LDIwLDEyLjVMMjEuMjUsMTIuNUMyMS4yNSwxMi4wMjA3ODI0NzA3MDMxMjUsMjEuMzgwNDkzMTY0MDYyNSwxMS41OTkyMTI2NDY0ODQzNzUsMjEuNjQxMzU3NDIxODc1LDExLjIzNDk4NTM1MTU2MjVDMjEuOTAyMDk5NjA5Mzc1LDEwLjg3MDgxOTA5MTc5Njg3NSwyMi4yMTk2MDQ0OTIxODc1LDEwLjU3MzczMDQ2ODc1LDIyLjU5Mzc1LDEwLjM0Mzc4MDUxNzU3ODEyNUMyMi4xNzcxMjQwMjM0Mzc1LDEwLjIzOTU5MzUwNTg1OTM3NSwyMS43NTUzNzEwOTM3NSwxMC4xNTYyNSwyMS4zMjg4NTc0MjE4NzUsMTAuMDkzNzVDMjAuOTAyMDk5NjA5Mzc1LDEwLjAzMTI4MDUxNzU3ODEyNSwyMC40NTkyMjg1MTU2MjUsMTAsMjAsMTBDMTcuMjA4NDk2MDkzNzUsMTAsMTQuODQzNzUsMTAuOTY4NzgwNTE3NTc4MTI1LDEyLjkwNjI1LDEyLjkwNjI1QzEwLjk2ODc1LDE0Ljg0Mzc1LDEwLDE3LjIwODM0MzUwNTg1OTM3NSwxMCwyMEwxNi4yNSwyMEMxNy42MjUsMjAsMTguODAyMDAxOTUzMTI1LDIwLjQ4OTU5MzUwNTg1OTM3NSwxOS43ODEyNSwyMS40Njg3NUMyMC43NjAzNzU5NzY1NjI1LDIyLjQ0Nzg3NTk3NjU2MjUsMjEuMjUsMjMuNjI1MDMwNTE3NTc4MTI1LDIxLjI1LDI1TDIxLjI1LDI2LjI1TDE3LjUsMjYuMjVMMTcuNSwyOS42ODc1QzE3LjkxNjc0ODA0Njg3NSwyOS43OTE2MjU5NzY1NjI1LDE4LjMyODM2OTE0MDYyNSwyOS44Njk5OTUxMTcxODc1LDE4LjczNTEwNzQyMTg3NSwyOS45MjI0ODUzNTE1NjI1QzE5LjE0MTcyMzYzMjgxMjUsMjkuOTc0OTc1NTg1OTM3NSwxOS41NjMzNTQ0OTIxODc1LDMwLjAwMDg1NDQ5MjE4NzUsMjAsMzAiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IGZpbGwtb3BhY2l0eTogMTsiLz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9zdmc+" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" href="#LINK3" target="_self" width="45px">
            </mj-image>
            <mj-text font-size="14px" align="center" font-family="Aptos, Calibri, sans-serif">World 
              <br/>News 
            </mj-text>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="10px">
            <mj-image src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSI0MCIgaWQ9InNjcmVlbnNob3QtNmJlMTcwOGMtZjQzNC04MDc3LTgwMDctMzU2NTlmZTcxMjUxIiB2aWV3Qm94PSIwIDAgNDAgNDAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBmaWxsPSJub25lIiB2ZXJzaW9uPSIxLjEiPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTY1OWZlNzEyNTEiPjxnIGNsYXNzPSJmcmFtZS1jb250YWluZXItd3JhcHBlciI+PGcgY2xhc3M9ImZyYW1lLWNvbnRhaW5lci1ibHVyIj48ZyBjbGFzcz0iZnJhbWUtY29udGFpbmVyLXNoYWRvd3MiPjxnIGZpbGw9Im5vbmUiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTZiZTE3MDhjLWY0MzQtODA3Ny04MDA3LTM1NjU5ZmU3MTI1MSI+PHJlY3Qgcng9IjAiIHJ5PSIwIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBjbGFzcz0iZnJhbWUtYmFja2dyb3VuZCIvPjwvZz48ZyBjbGFzcz0iZnJhbWUtY2hpbGRyZW4iPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTY1YzhhMzE0NTgiIHJ4PSIwIiByeT0iMCI+PGcgaWQ9InNoYXBlLTZiZTE3MDhjLWY0MzQtODA3Ny04MDA3LTM1NjVjOGEzMTQ1OSI+PGcgY2xhc3M9ImZpbGxzIiBpZD0iZmlsbHMtNmJlMTcwOGMtZjQzNC04MDc3LTgwMDctMzU2NWM4YTMxNDU5Ij48ZWxsaXBzZSBjeD0iMjAiIGN5PSIyMCIgcng9IjIwIiByeT0iMjAiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBzdHlsZT0iZmlsbDogcmdiKDE1MSwgMTUzLCAxNTUpOyBmaWxsLW9wYWNpdHk6IDE7Ii8+PC9nPjwvZz48ZyBpZD0ic2hhcGUtNmJlMTcwOGMtZjQzNC04MDc3LTgwMDctMzU2NWM4YTMxNDVhIiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSIwIiByeT0iMCIgc3R5bGU9ImZpbGw6IHJnYigwLCAwLCAwKTsiPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTY1YzhhMzE0NWIiIHN0eWxlPSJkaXNwbGF5OiBub25lOyI+PGcgY2xhc3M9ImZpbGxzIiBpZD0iZmlsbHMtNmJlMTcwOGMtZjQzNC04MDc3LTgwMDctMzU2NWM4YTMxNDViIj48cmVjdCB3aWR0aD0iMjgiIGhlaWdodD0iMjgiIHg9IjYiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBmaWxsLW9wYWNpdHk6IDE7IiByeT0iMCIgZmlsbD0ibm9uZSIgcng9IjAiIHk9IjYiLz48L2c+PC9nPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTY1YzhhMzE0NWMiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTZiZTE3MDhjLWY0MzQtODA3Ny04MDA3LTM1NjVjOGEzMTQ1YyI+PHBhdGggZD0iTTI0LjY2Njc0ODA0Njg3NSw4LjMzMzM0MzUwNTg1OTM3NUMyNS4yNTgzMDA3ODEyNSw4LjMzMzQwNDU0MTAxNTYyNSwyNS43NTYxMDM1MTU2MjUsOC43NzYxMjMwNDY4NzUsMjUuODI1MTk1MzEyNSw5LjM2MzQ5NDg3MzA0Njg3NUwyNS44MzM0OTYwOTM3NSw5LjVMMjUuODMzNDk2MDkzNzUsMTAuNjY2NjU2NDk0MTQwNjI1TDI3LDEwLjY2NjY1NjQ5NDE0MDYyNUMyOC44NTMyNzE0ODQzNzUsMTAuNjY2NTk1NDU4OTg0Mzc1LDMwLjM4NTQ5ODA0Njg3NSwxMi4xMTExNzU1MzcxMDkzNzUsMzAuNDk0MTQwNjI1LDEzLjk2MTMwMzcxMDkzNzVMMzAuNSwxNC4xNjY2NTY0OTQxNDA2MjVMMzAuNSwyOC4xNjY2NTY0OTQxNDA2MjVDMzAuNTAwMjQ0MTQwNjI1LDMwLjAxOTk4OTAxMzY3MTg3NSwyOS4wNTU2NjQwNjI1LDMxLjU1MjA5MzUwNTg1OTM3NSwyNy4yMDU1NjY0MDYyNSwzMS42NjA3OTcxMTkxNDA2MjVMMjcsMzEuNjY2NjU2NDk0MTQwNjI1TDEzLDMxLjY2NjY1NjQ5NDE0MDYyNUMxMS4xNDY3Mjg1MTU2MjUsMzEuNjY2NzQ4MDQ2ODc1LDkuNjE0NTAxOTUzMTI1LDMwLjIyMjE2Nzk2ODc1LDkuNTA1ODU5Mzc1LDI4LjM3MjAzOTc5NDkyMTg3NUw5LjUsMjguMTY2NjU2NDk0MTQwNjI1TDkuNSwxNC4xNjY2NTY0OTQxNDA2MjVDOS41LDEyLjMxMzM1NDQ5MjE4NzUsMTAuOTQ0NTgwMDc4MTI1LDEwLjc4MTI1LDEyLjc5NDY3NzczNDM3NSwxMC42NzI1MTU4NjkxNDA2MjVMMTMsMTAuNjY2NjU2NDk0MTQwNjI1TDE0LjE2Njc0ODA0Njg3NSwxMC42NjY2NTY0OTQxNDA2MjVMMTQuMTY2NzQ4MDQ2ODc1LDkuNUMxNC4xNjc0ODA0Njg3NSw4Ljg4MjY5MDQyOTY4NzUsMTQuNjQ4OTI1NzgxMjUsOC4zNzI4MDI3MzQzNzUsMTUuMjY1MTM2NzE4NzUsOC4zMzY1NzgzNjkxNDA2MjVDMTUuODgxMzQ3NjU2MjUsOC4zMDA0NDU1NTY2NDA2MjUsMTYuNDE4OTQ1MzEyNSw4Ljc1MDUxODc5ODgyODEyNSwxNi40OTE5NDMzNTkzNzUsOS4zNjM0OTQ4NzMwNDY4NzVMMTYuNSw5LjVMMTYuNSwxMC42NjY2NTY0OTQxNDA2MjVMMjMuNSwxMC42NjY2NTY0OTQxNDA2MjVMMjMuNSw5LjVDMjMuNSw4Ljg1NTYyMTMzNzg5MDYyNSwyNC4wMjI0NjA5Mzc1LDguMzMzMzQzNTA1ODU5Mzc1LDI0LjY2Njc0ODA0Njg3NSw4LjMzMzM0MzUwNTg1OTM3NU0yOC4xNjY3NDgwNDY4NzUsMTYuNUwxMS44MzM0OTYwOTM3NSwxNi41TDExLjgzMzQ5NjA5Mzc1LDI3LjcyOTE1NjQ5NDE0MDYyNUMxMS44MzM0OTYwOTM3NSwyOC41NTE2NjYyNTk3NjU2MjUsMTIuMjgzNjkxNDA2MjUsMjkuMjI5NDkyMTg3NSwxMi44NjM3Njk1MzEyNSwyOS4zMjI4NzU5NzY1NjI1TDEzLDI5LjMzMzM0MzUwNTg1OTM3NUwyNywyOS4zMzMzNDM1MDU4NTkzNzVDMjcuNTk4NjMyODEyNSwyOS4zMzMzNDM1MDU4NTkzNzUsMjguMDkyMDQxMDE1NjI1LDI4LjcxNDk2NTgyMDMxMjUsMjguMTU4NjkxNDA2MjUsMjcuOTE1ODAyMDAxOTUzMTI1TDI4LjE2Njc0ODA0Njg3NSwyNy43MjkxNTY0OTQxNDA2MjVaIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBmaWxsLW9wYWNpdHk6IDE7Ii8+PC9nPjwvZz48ZyBpZD0ic2hhcGUtNmJlMTcwOGMtZjQzNC04MDc3LTgwMDctMzU2NWM4YTMxNDVkIj48ZyBjbGFzcz0iZmlsbHMiIGlkPSJmaWxscy02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTY1YzhhMzE0NWQiPjxwYXRoIGQ9Ik0xNS4zMzM0OTYwOTM3NSwyMi4zMzMzNDM1MDU4NTkzNzVMMTcuNjY2NzQ4MDQ2ODc1LDIyLjMzMzM0MzUwNTg1OTM3NUwxNy42NjY3NDgwNDY4NzUsMjQuNjY2NjU2NDk0MTQwNjI1TDE1LjMzMzQ5NjA5Mzc1LDI0LjY2NjY1NjQ5NDE0MDYyNVoiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IGZpbGwtb3BhY2l0eTogMTsiLz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9zdmc+" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" href="#LINK4" target="_self" width="45px">
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
            <mj-image src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSI0NSIgaWQ9InNjcmVlbnNob3QtNmJlMTcwOGMtZjQzNC04MDc3LTgwMDctMzU2YWFmN2E3OTlmIiB2aWV3Qm94PSIwIDAgNDUgNDUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBmaWxsPSJub25lIiB2ZXJzaW9uPSIxLjEiPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTZhYWY3YTc5OWYiPjxnIGNsYXNzPSJmcmFtZS1jb250YWluZXItd3JhcHBlciI+PGcgY2xhc3M9ImZyYW1lLWNvbnRhaW5lci1ibHVyIj48ZyBjbGFzcz0iZnJhbWUtY29udGFpbmVyLXNoYWRvd3MiPjxnIGZpbGw9Im5vbmUiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTZiZTE3MDhjLWY0MzQtODA3Ny04MDA3LTM1NmFhZjdhNzk5ZiI+PHJlY3Qgcng9IjAiIHJ5PSIwIiB4PSIwIiB5PSIwIiB3aWR0aD0iNDUiIGhlaWdodD0iNDUiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBjbGFzcz0iZnJhbWUtYmFja2dyb3VuZCIvPjwvZz48ZyBjbGFzcz0iZnJhbWUtY2hpbGRyZW4iPjxnIGlkPSJzaGFwZS02YmUxNzA4Yy1mNDM0LTgwNzctODAwNy0zNTZhYWY3YTc5YTAiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTZiZTE3MDhjLWY0MzQtODA3Ny04MDA3LTM1NmFhZjdhNzlhMCI+PHBhdGggZD0iTTIyLjUsMEMxMC4xMjUxODMxMDU0Njg3NSwwLDAsMTAuMTI0OTM4OTY0ODQzNzUsMCwyMi40OTk5MDg0NDcyNjU2MjVDMCwzNC44NzUwNjEwMzUxNTYyNSwxMC4xMjUxODMxMDU0Njg3NSw0NS4wMDAwNjEwMzUxNTYyNSwyMi41LDQ1LjAwMDA2MTAzNTE1NjI1QzM0Ljg3NDgxNjg5NDUzMTI1LDQ1LjAwMDA2MTAzNTE1NjI1LDQ1LDM0Ljg3NTA2MTAzNTE1NjI1LDQ1LDIyLjQ5OTkwODQ0NzI2NTYyNUM0NSwxMC4xMjQ5Mzg5NjQ4NDM3NSwzNC44NzQ4MTY4OTQ1MzEyNSwwLDIyLjUsME0yNy4wMDAxODMxMDU0Njg3NSwzMS40OTk5MDg0NDcyNjU2MjVMMjcuMDAwMTgzMTA1NDY4NzUsMjQuNzUwMDkxNTUyNzM0Mzc1QzE4Ljg3NzU2MzQ3NjU2MjUsMjQuNzUwMDkxNTUyNzM0Mzc1LDEzLjA3MjM4NzY5NTMxMjUsMjcuOTY3NTI5Mjk2ODc1LDguOTk5ODE2ODk0NTMxMjUsMzMuNzVDMTAuNjE5NjI4OTA2MjUsMjUuNDkyNTUzNzEwOTM3NSwxNS42MTUxMTIzMDQ2ODc1LDE3LjM5MjM5NTAxOTUzMTI1LDI3LjAwMDE4MzEwNTQ2ODc1LDE1Ljc0OTkzODk2NDg0Mzc1TDI3LjAwMDE4MzEwNTQ2ODc1LDguOTk5ODc3OTI5Njg3NUwzOC4yNTAxODMxMDU0Njg3NSwyMC4yNDk5MDg0NDcyNjU2MjVaIiBzdHlsZT0iZmlsbDogcmdiKDEzNCwgMTg4LCAzNyk7IGZpbGwtb3BhY2l0eTogMTsiLz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==" padding-top="0px" padding-bottom="0px" padding-right="0px" align="left" width="50px" padding-left="0px">
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
<mj-section padding-top="10px" padding-bottom="0px" background-color="#ffffff" padding-left="25px" padding-right="25px">
        <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="100%">
          <mj-text font-family="Aptos, Calibri, sans-serif" padding-top="5px" padding-bottom="0px" font-size="12px" line-height="18px" color="#97999b" font-weight="700" padding-right="0px" padding-left="0px">Raport
          </mj-text>
          <mj-text font-size="24px" font-family="Aptos, Calibri, sans-serif" font-weight="700" padding-top="0px" padding-bottom="5px" line-height="28px" padding-right="0px" padding-left="0px">2026 financial services 
            <br/>industry outlooks
          </mj-text>
          <mj-text font-family="Aptos, Calibri, sans-serif" padding-top="0px" font-size="15px" line-height="18px" padding-right="0px" padding-left="0px">A guide to help you navigate what’s next and lead the industry forward in a time of extraordinary technological disruption, shifting customer expectations, regulatory complexity, and dynamic competition.
          </mj-text>
        </mj-column>
        <mj-group width="100%">
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="30%">
            <mj-button background-color="#fbfbee" border-radius="20px 20px 20px 20px" font-size="11px" font-weight="700" color="#000000" padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px" align="left" font-family="Aptos, Calibri, sans-serif" width="100%">Download Report
            </mj-button>
          </mj-column>
          <mj-column padding-top="0px" padding-right="0px" padding-bottom="0px" padding-left="0px" width="30%">
            <mj-button background-color="#e1fdff" border-radius="20px 20px 20px 20px" font-size="11px" font-weight="700" color="#000000" padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px" align="left" font-family="Aptos, Calibri, sans-serif" width="100%">Share on Linkedin
            </mj-button>
          </mj-column>
          <mj-column padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" width="30%">
            <mj-button background-color="#d8fef3" border-radius="20px 20px 20px 20px" font-size="11px" font-weight="700" color="#000000" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px" align="left" font-family="Aptos, Calibri, sans-serif" width="100%">Share on Facebook 
            </mj-button>
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
            <mj-image src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSI1MCIgaWQ9InNjcmVlbnNob3QtNmU4NWYwZDQtNzg2ZS04MGI0LTgwMDctMzU3ODQ2OTIwNzM3IiB2aWV3Qm94PSIwIDAgNTAgNTAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBmaWxsPSJub25lIiB2ZXJzaW9uPSIxLjEiPjxnIGlkPSJzaGFwZS02ZTg1ZjBkNC03ODZlLTgwYjQtODAwNy0zNTc4NDY5MjA3MzciPjxnIGNsYXNzPSJmcmFtZS1jb250YWluZXItd3JhcHBlciI+PGcgY2xhc3M9ImZyYW1lLWNvbnRhaW5lci1ibHVyIj48ZyBjbGFzcz0iZnJhbWUtY29udGFpbmVyLXNoYWRvd3MiPjxnIGZpbGw9Im5vbmUiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTZlODVmMGQ0LTc4NmUtODBiNC04MDA3LTM1Nzg0NjkyMDczNyI+PHJlY3Qgcng9IjAiIHJ5PSIwIiB4PSIwIiB5PSIwIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBjbGFzcz0iZnJhbWUtYmFja2dyb3VuZCIvPjwvZz48ZyBjbGFzcz0iZnJhbWUtY2hpbGRyZW4iPjxnIGlkPSJzaGFwZS02ZTg1ZjBkNC03ODZlLTgwYjQtODAwNy0zNTc4NWE4N2VkM2YiIHJ4PSIwIiByeT0iMCI+PGcgaWQ9InNoYXBlLTZlODVmMGQ0LTc4NmUtODBiNC04MDA3LTM1Nzg1YTg3ZWQ0MCI+PGcgY2xhc3M9ImZpbGxzIiBpZD0iZmlsbHMtNmU4NWYwZDQtNzg2ZS04MGI0LTgwMDctMzU3ODVhODdlZDQwIj48ZWxsaXBzZSBjeD0iMjUiIGN5PSIyNSIgcng9IjI1IiByeT0iMjUiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBzdHlsZT0iZmlsbDogcmdiKDk4LCAxODEsIDIyOSk7IGZpbGwtb3BhY2l0eTogMTsiLz48L2c+PC9nPjxnIGlkPSJzaGFwZS02ZTg1ZjBkNC03ODZlLTgwYjQtODAwNy0zNTc4NWE4N2VkNDEiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgcng9IjAiIHJ5PSIwIiBzdHlsZT0iZmlsbDogcmdiKDAsIDAsIDApOyI+PGcgaWQ9InNoYXBlLTZlODVmMGQ0LTc4NmUtODBiNC04MDA3LTM1Nzg1YTg4MDdjMCIgc3R5bGU9ImRpc3BsYXk6IG5vbmU7Ij48ZyBjbGFzcz0iZmlsbHMiIGlkPSJmaWxscy02ZTg1ZjBkNC03ODZlLTgwYjQtODAwNy0zNTc4NWE4ODA3YzAiPjxyZWN0IHdpZHRoPSIzMi41IiBoZWlnaHQ9IjMyLjUiIHg9IjguNzUiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBzdHlsZT0iZmlsbDogbm9uZTsiIHJ5PSIwIiBmaWxsPSJub25lIiByeD0iMCIgeT0iOC43NSIvPjwvZz48L2c+PGcgaWQ9InNoYXBlLTZlODVmMGQ0LTc4NmUtODBiNC04MDA3LTM1Nzg1YTg4MDdjMSIgcng9IjAiIHJ5PSIwIiBzdHlsZT0iZmlsbDogcmdiKDAsIDAsIDApOyI+PGcgaWQ9InNoYXBlLTZlODVmMGQ0LTc4NmUtODBiNC04MDA3LTM1Nzg1YTg4MDdjMiI+PGcgY2xhc3M9ImZpbGxzIiBpZD0iZmlsbHMtNmU4NWYwZDQtNzg2ZS04MGI0LTgwMDctMzU3ODVhODgwN2MyIj48cGF0aCBkPSJNMjUuODAzMTAwNTg1OTM3NSw0MC4yNDUxMTcxODc1TDI1Ljc4ODE0Njk3MjY1NjI1LDQwLjI0ODA0Njg3NUwyNS42OTIwMTY2MDE1NjI1LDQwLjI5NTE2NjAxNTYyNUwyNS42NjQ5NzgwMjczNDM3NSw0MC4zMDA2NTkxNzk2ODc1TDI1LjY0NTkzNTA1ODU5Mzc1LDQwLjI5NTE2NjAxNTYyNUwyNS41NDk3NDM2NTIzNDM3NSw0MC4yNDgwNDY4NzVDMjUuNTM1NDAwMzkwNjI1LDQwLjI0MzQwODIwMzEyNSwyNS41MjQ0NzUwOTc2NTYyNSw0MC4yNDU2MDU0Njg3NSwyNS41MTcyNzI5NDkyMTg3NSw0MC4yNTQ3NjA3NDIxODc1TDI1LjUxMTkwMTg1NTQ2ODc1LDQwLjI2ODMxMDU0Njg3NUwyNS40ODg4OTE2MDE1NjI1LDQwLjg0Nzc3ODMyMDMxMjVMMjUuNDk1NzI3NTM5MDYyNSw0MC44NzVMMjUuNTA5MTU1MjczNDM3NSw0MC44OTI1NzgxMjVMMjUuNjUwMDI0NDE0MDYyNSw0MC45OTI2NzU3ODEyNUwyNS42NzAzNDkxMjEwOTM3NSw0MC45OTgxNjg5NDUzMTI1TDI1LjY4NjUyMzQzNzUsNDAuOTkyNjc1NzgxMjVMMjUuODI3NDUzNjEzMjgxMjUsNDAuODkyNTc4MTI1TDI1Ljg0MzY4ODk2NDg0Mzc1LDQwLjg3MDg0OTYwOTM3NUwyNS44NDg5OTkwMjM0Mzc1LDQwLjg0Nzc3ODMyMDMxMjVMMjUuODI1OTg4NzY5NTMxMjUsNDAuMjY5NTMxMjVDMjUuODIyNTcwODAwNzgxMjUsNDAuMjU1MTI2OTUzMTI1LDI1LjgxNDgxOTMzNTkzNzUsNDAuMjQ2OTQ4MjQyMTg3NSwyNS44MDMxMDA1ODU5Mzc1LDQwLjI0NTExNzE4NzVNMjYuMTYxODA0MTk5MjE4NzUsNDAuMDkyMTYzMDg1OTM3NUwyNi4xNDQyODcxMDkzNzUsNDAuMDk0ODQ4NjMyODEyNUwyNS44OTM3Mzc3OTI5Njg3NSw0MC4yMjA3MDMxMjVMMjUuODgwMjQ5MDIzNDM3NSw0MC4yMzQzNzVMMjUuODc2MDM3NTk3NjU2MjUsNDAuMjQ5MjY3NTc4MTI1TDI1LjkwMDQ1MTY2MDE1NjI1LDQwLjgzMTU0Mjk2ODc1TDI1LjkwNzE2NTUyNzM0Mzc1LDQwLjg0Nzc3ODMyMDMxMjVMMjUuOTE4MTUxODU1NDY4NzUsNDAuODU3Mjk5ODA0Njg3NUwyNi4xOTAzNjg2NTIzNDM3NSw0MC45ODMyNzYzNjcxODc1QzI2LjIwNzQ1ODQ5NjA5Mzc1LDQwLjk4Nzc5Mjk2ODc1LDI2LjIyMDUyMDAxOTUzMTI1LDQwLjk4NDEzMDg1OTM3NSwyNi4yMjk2NzUyOTI5Njg3NSw0MC45NzIyOTAwMzkwNjI1TDI2LjIzNDkyNDMxNjQwNjI1LDQwLjk1MzM2OTE0MDYyNUwyNi4xODg5NjQ4NDM3NSw0MC4xMjE5NDgyNDIxODc1QzI2LjE4NDUwOTI3NzM0Mzc1LDQwLjEwNTcxMjg5MDYyNSwyNi4xNzU0MTUwMzkwNjI1LDQwLjA5NTcwMzEyNSwyNi4xNjE4MDQxOTkyMTg3NSw0MC4wOTIxNjMwODU5Mzc1TTI1LjE5MzY2NDU1MDc4MTI1LDQwLjA5NDg0ODYzMjgxMjVDMjUuMTgxMjc0NDE0MDYyNSw0MC4wODc1MjQ0MTQwNjI1LDI1LjE2NTIyMjE2Nzk2ODc1LDQwLjA5MDk0MjM4MjgxMjUsMjUuMTU3MTY1NTI3MzQzNzUsNDAuMTAyOTA1MjczNDM3NUwyNS4xNDg5MjU3ODEyNSw0MC4xMjE5NDgyNDIxODc1TDI1LjEwMjk2NjMwODU5Mzc1LDQwLjk1MzM2OTE0MDYyNUMyNS4xMDM3NTk3NjU2MjUsNDAuOTY5NjA0NDkyMTg3NSwyNS4xMTE1MTEyMzA0Njg3NSw0MC45ODA1OTA4MjAzMTI1LDI1LjEyNjAzNzU5NzY1NjI1LDQwLjk4NTk2MTkxNDA2MjVMMjUuMTQ2MTc5MTk5MjE4NzUsNDAuOTgzMjc2MzY3MTg3NUwyNS40MTg1MTgwNjY0MDYyNSw0MC44NTcyOTk4MDQ2ODc1TDI1LjQzMTk0NTgwMDc4MTI1LDQwLjg0NjU1NzYxNzE4NzVMMjUuNDM3MzE2ODk0NTMxMjUsNDAuODMxNTQyOTY4NzVMMjUuNDYwMzg4MTgzNTkzNzUsNDAuMjQ5MjY3NTc4MTI1TDI1LjQ1NjM1OTg2MzI4MTI1LDQwLjIzMzAzMjIyNjU2MjVMMjUuNDQyOTMyMTI4OTA2MjUsNDAuMjE5NDgyNDIxODc1WiIgZmlsbD0ibm9uZSIgc3R5bGU9ImZpbGw6IG5vbmU7Ii8+PC9nPjwvZz48ZyBpZD0ic2hhcGUtNmU4NWYwZDQtNzg2ZS04MGI0LTgwMDctMzU3ODVhODgwN2MzIj48ZyBjbGFzcz0iZmlsbHMiIGlkPSJmaWxscy02ZTg1ZjBkNC03ODZlLTgwYjQtODAwNy0zNTc4NWE4ODA3YzMiPjxwYXRoIGQ9Ik0zMC40MTY2ODcwMTE3MTg3NSwxMi44MTI1QzMxLjgzMzkyMzMzOTg0Mzc1LDEyLjgxMjEzMzc4OTA2MjUsMzMuMDExOTAxODU1NDY4NzUsMTMuOTA0NDE4OTQ1MzEyNSwzMy4xMTgyODYxMzI4MTI1LDE1LjMxNzYyNjk1MzEyNUwzMy4xMjUsMTUuNTIwODc0MDIzNDM3NUwzMy4xMjUsMjIuMjkxNjI1OTc2NTYyNUwzNS4xNTYyNSwyMi4yOTE2MjU5NzY1NjI1QzM2LjIwMjUxNDY0ODQzNzUsMjIuMjkxNjI1OTc2NTYyNSwzNy4wNzc2MzY3MTg3NSwyMy4wODY1NDc4NTE1NjI1LDM3LjE3ODAzOTU1MDc4MTI1LDI0LjEyNzkyOTY4NzVMMzcuMTg3NSwyNC4zMjI4NzU5NzY1NjI1TDM3LjE4NzUsMzQuNDc5MTI1OTc2NTYyNUMzNy4xODc1LDM2LjYzMDI0OTAyMzQzNzUsMzUuNTEwODY0MjU3ODEyNSwzOC40MDg2OTE0MDYyNSwzMy4zNjM0NjQzNTU0Njg3NSwzOC41MzQ5MTIxMDkzNzVMMzMuMTI1LDM4LjU0MTYyNTk3NjU2MjVMMTUuNTIwODEyOTg4MjgxMjUsMzguNTQxNjI1OTc2NTYyNUMxNC4xMDM1NzY2NjAxNTYyNSwzOC41NDIxMTQyNTc4MTI1LDEyLjkyNTU5ODE0NDUzMTI1LDM3LjQ0OTcwNzAzMTI1LDEyLjgxOTIxMzg2NzE4NzUsMzYuMDM2NDk5MDIzNDM3NUwxMi44MTI1LDM1LjgzMzM3NDAyMzQzNzVMMTIuODEyNSwxNS41MjA4NzQwMjM0Mzc1QzEyLjgxMjA3Mjc1MzkwNjI1LDE0LjEwMzYzNzY5NTMxMjUsMTMuOTA0NDE4OTQ1MzEyNSwxMi45MjU2NTkxNzk2ODc1LDE1LjMxNzY4Nzk4ODI4MTI1LDEyLjgxOTIxMzg2NzE4NzVMMTUuNTIwODEyOTg4MjgxMjUsMTIuODEyNVpNMzQuNDc5MTg3MDExNzE4NzUsMjVMMzMuMTI1LDI1TDMzLjEyNSwzNS44MzMzNzQwMjM0Mzc1QzMzLjg3Mjg2Mzc2OTUzMTI1LDM1LjgzMzM3NDAyMzQzNzUsMzQuNDc5MTg3MDExNzE4NzUsMzUuMjI3MDUwNzgxMjUsMzQuNDc5MTg3MDExNzE4NzUsMzQuNDc5MTI1OTc2NTYyNVpNMjMuNjQ1ODEyOTg4MjgxMjUsMjYuMzU0MTI1OTc2NTYyNUwxOS41ODMzMTI5ODgyODEyNSwyNi4zNTQxMjU5NzY1NjI1QzE4Ljg2Njc2MDI1MzkwNjI1LDI2LjM1NDk4MDQ2ODc1LDE4LjI3NDk2MzM3ODkwNjI1LDI2LjkxMzY5NjI4OTA2MjUsMTguMjMzMDMyMjI2NTYyNSwyNy42MjkwMjgzMjAzMTI1QzE4LjE5MDkxNzk2ODc1LDI4LjM0NDM2MDM1MTU2MjUsMTguNzEzMzc4OTA2MjUsMjguOTY4MzgzNzg5MDYyNSwxOS40MjQ4NjU3MjI2NTYyNSwyOS4wNTI5Nzg1MTU2MjVMMTkuNTgzMzEyOTg4MjgxMjUsMjkuMDYyNUwyMy42NDU4MTI5ODgyODEyNSwyOS4wNjI1QzI0LjM2MjM2NTcyMjY1NjI1LDI5LjA2MTY0NTUwNzgxMjUsMjQuOTU0MjIzNjMyODEyNSwyOC41MDMwNTE3NTc4MTI1LDI0Ljk5NjE1NDc4NTE1NjI1LDI3Ljc4NzcxOTcyNjU2MjVDMjUuMDM4MjY5MDQyOTY4NzUsMjcuMDcyMzg3Njk1MzEyNSwyNC41MTU4MDgxMDU0Njg3NSwyNi40NDgyNDIxODc1LDIzLjgwNDMyMTI4OTA2MjUsMjYuMzYzNjQ3NDYwOTM3NVpNMjYuMzU0MTg3MDExNzE4NzUsMTkuNTgzMzc0MDIzNDM3NUwxOS41ODMzMTI5ODgyODEyNSwxOS41ODMzNzQwMjM0Mzc1QzE4LjgzNTQ0OTIxODc1LDE5LjU4MzM3NDAyMzQzNzUsMTguMjI5MTg3MDExNzE4NzUsMjAuMTg5NTc1MTk1MzEyNSwxOC4yMjkxODcwMTE3MTg3NSwyMC45Mzc1QzE4LjIyOTE4NzAxMTcxODc1LDIxLjY4NTQyNDgwNDY4NzUsMTguODM1NDQ5MjE4NzUsMjIuMjkxNjI1OTc2NTYyNSwxOS41ODMzMTI5ODgyODEyNSwyMi4yOTE2MjU5NzY1NjI1TDI2LjM1NDE4NzAxMTcxODc1LDIyLjI5MTYyNTk3NjU2MjVDMjcuMTAyMDUwNzgxMjUsMjIuMjkxNjI1OTc2NTYyNSwyNy43MDgzMTI5ODgyODEyNSwyMS42ODU0MjQ4MDQ2ODc1LDI3LjcwODMxMjk4ODI4MTI1LDIwLjkzNzVDMjcuNzA4MzEyOTg4MjgxMjUsMjAuMTg5NTc1MTk1MzEyNSwyNy4xMDIwNTA3ODEyNSwxOS41ODMzNzQwMjM0Mzc1LDI2LjM1NDE4NzAxMTcxODc1LDE5LjU4MzM3NDAyMzQzNzUiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IGZpbGwtb3BhY2l0eTogMTsiLz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvc3ZnPg==" padding-top="0px" padding-bottom="0px" padding-right="0px" align="left" width="50px" padding-left="0px">
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
        <mj-group width="100%">
          <mj-column padding-top="10px" padding-right="0px" padding-bottom="0px" padding-left="0px" width="30%">
            <mj-button border-radius="20px 20px 20px 20px" font-size="12px" font-weight="700" color="#000000" padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px" align="left" font-family="Aptos, Calibri, sans-serif" width="100%" background-color="#e1fdff" border="0 none black">Read the article
            </mj-button>
          </mj-column>
        </mj-group>
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
            <mj-image src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSI1MCIgaWQ9InNjcmVlbnNob3QtNmU4NWYwZDQtNzg2ZS04MGI0LTgwMDctMzU3ZTMwMDQzNjM4IiB2aWV3Qm94PSIwIDAgNTAgNTAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBmaWxsPSJub25lIiB2ZXJzaW9uPSIxLjEiPjxnIGlkPSJzaGFwZS02ZTg1ZjBkNC03ODZlLTgwYjQtODAwNy0zNTdlMzAwNDM2MzgiPjxnIGNsYXNzPSJmcmFtZS1jb250YWluZXItd3JhcHBlciI+PGcgY2xhc3M9ImZyYW1lLWNvbnRhaW5lci1ibHVyIj48ZyBjbGFzcz0iZnJhbWUtY29udGFpbmVyLXNoYWRvd3MiPjxnIGZpbGw9Im5vbmUiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTZlODVmMGQ0LTc4NmUtODBiNC04MDA3LTM1N2UzMDA0MzYzOCI+PHJlY3Qgcng9IjAiIHJ5PSIwIiB4PSIwIiB5PSIwIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBjbGFzcz0iZnJhbWUtYmFja2dyb3VuZCIvPjwvZz48ZyBjbGFzcz0iZnJhbWUtY2hpbGRyZW4iPjxnIGlkPSJzaGFwZS04ODY5MGZiOC02MjBmLTgwOTYtODAwNy00MTY5NTE2ZmQ1MzciIHJ4PSIwIiByeT0iMCI+PGcgaWQ9InNoYXBlLTg4NjkwZmI4LTYyMGYtODA5Ni04MDA3LTQxNjk1MTZmZDUzOCI+PGcgY2xhc3M9ImZpbGxzIiBpZD0iZmlsbHMtODg2OTBmYjgtNjIwZi04MDk2LTgwMDctNDE2OTUxNmZkNTM4Ij48ZWxsaXBzZSBjeD0iMjUiIGN5PSIyNSIgcng9IjI1IiByeT0iMjUiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBzdHlsZT0iZmlsbDogcmdiKDEzLCAxMzEsIDE0NCk7IGZpbGwtb3BhY2l0eTogMTsiLz48L2c+PC9nPjxnIGlkPSJzaGFwZS04ODY5MGZiOC02MjBmLTgwOTYtODAwNy00MTY5NTE2ZmQ1MzkiIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgcng9IjAiIHJ5PSIwIiBzdHlsZT0iZmlsbDogcmdiKDAsIDAsIDApOyI+PGcgaWQ9InNoYXBlLTg4NjkwZmI4LTYyMGYtODA5Ni04MDA3LTQxNjk1MTZmZDUzYSIgc3R5bGU9ImRpc3BsYXk6IG5vbmU7Ij48ZyBjbGFzcz0iZmlsbHMiIGlkPSJmaWxscy04ODY5MGZiOC02MjBmLTgwOTYtODAwNy00MTY5NTE2ZmQ1M2EiPjxyZWN0IHdpZHRoPSIzNy41IiBoZWlnaHQ9IjM3LjUiIHg9IjYuMjUiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBmaWxsLW9wYWNpdHk6IDE7IiByeT0iMCIgZmlsbD0ibm9uZSIgcng9IjAiIHk9IjYuMjUiLz48L2c+PC9nPjxnIGlkPSJzaGFwZS04ODY5MGZiOC02MjBmLTgwOTYtODAwNy00MTY5NTE2ZmQ1M2IiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTg4NjkwZmI4LTYyMGYtODA5Ni04MDA3LTQxNjk1MTZmZDUzYiI+PHBhdGggZD0iTTI1LDQwLjYyNUMyMi44Mzg1NjIwMTE3MTg3NSw0MC42MjUsMjAuODA3MzEyMDExNzE4NzUsNDAuMjE0MzU1NDY4NzUsMTguOTA2MjUsMzkuMzkzNzk4ODI4MTI1QzE3LjAwNTE4Nzk4ODI4MTI1LDM4LjU3Mjk5ODA0Njg3NSwxNS4zNTE0NDA0Mjk2ODc1LDM3LjQ1OTk2MDkzNzUsMTMuOTQ1NDM0NTcwMzEyNSwzNi4wNTQ2ODc1QzEyLjUzOTA2MjUsMzQuNjQ5NDE0MDYyNSwxMS40MjU5NjQzNTU0Njg3NSwzMi45OTU4NDk2MDkzNzUsMTAuNjA2MjAxMTcxODc1LDMxLjA5Mzc1QzkuNzg2Mzc2OTUzMTI1LDI5LjE5MTY1MDM5MDYyNSw5LjM3NTkxNTUyNzM0Mzc1LDI3LjE2MDQwMDM5MDYyNSw5LjM3NSwyNUM5LjM3NDA4NDQ3MjY1NjI1LDIyLjgzOTU5OTYwOTM3NSw5Ljc4NDM2Mjc5Mjk2ODc1LDIwLjgwODM0OTYwOTM3NSwxMC42MDYyMDExNzE4NzUsMTguOTA2MjVDMTEuNDI4MDM5NTUwNzgxMjUsMTcuMDA0MTUwMzkwNjI1LDEyLjU0MTE5ODczMDQ2ODc1LDE1LjM1MDU4NTkzNzUsMTMuOTQ1NDM0NTcwMzEyNSwxMy45NDUzMTI1QzE1LjM0OTQyNjI2OTUzMTI1LDEyLjU0MDAzOTA2MjUsMTcuMDAzMDUxNzU3ODEyNSwxMS40MjcxMjQwMjM0Mzc1LDE4LjkwNjI1LDEwLjYwNjMyMzI0MjE4NzVDMjAuODA5MzI2MTcxODc1LDkuNzg1NDAwMzkwNjI1LDIyLjg0MDY5ODI0MjE4NzUsOS4zNzUsMjUsOS4zNzVDMjcuMTU5MzAxNzU3ODEyNSw5LjM3NSwyOS4xOTA2NzM4MjgxMjUsOS43ODU0MDAzOTA2MjUsMzEuMDkzNzUsMTAuNjA2MzIzMjQyMTg3NUMzMi45OTY5NDgyNDIxODc1LDExLjQyNzEyNDAyMzQzNzUsMzQuNjUwNTczNzMwNDY4NzUsMTIuNTQwMDM5MDYyNSwzNi4wNTQ1NjU0Mjk2ODc1LDEzLjk0NTMxMjVDMzcuNDU4ODAxMjY5NTMxMjUsMTUuMzUwNTg1OTM3NSwzOC41NzIyNjU2MjUsMTcuMDA0MTUwMzkwNjI1LDM5LjM5NTMyNDcwNzAzMTI1LDE4LjkwNjI1QzQwLjIxODIwMDY4MzU5Mzc1LDIwLjgwODM0OTYwOTM3NSw0MC42MjgwNTE3NTc4MTI1LDIyLjgzOTU5OTYwOTM3NSw0MC42MjUsMjVDNDAuNjIxOTQ4MjQyMTg3NSwyNy4xNjA0MDAzOTA2MjUsNDAuMjExNDg2ODE2NDA2MjUsMjkuMTkxNjUwMzkwNjI1LDM5LjM5Mzc5ODgyODEyNSwzMS4wOTM3NUMzOC41NzYxNzE4NzUsMzIuOTk1ODQ5NjA5Mzc1LDM3LjQ2Mjk1MTY2MDE1NjI1LDM0LjY0OTQxNDA2MjUsMzYuMDU0NTY1NDI5Njg3NSwzNi4wNTQ2ODc1QzM0LjY0NjQyMzMzOTg0Mzc1LDM3LjQ1OTk2MDkzNzUsMzIuOTkyNzM2ODE2NDA2MjUsMzguNTczNDg2MzI4MTI1LDMxLjA5Mzc1LDM5LjM5NTI2MzY3MTg3NUMyOS4xOTQ4MjQyMTg3NSw0MC4yMTcyODUxNTYyNSwyNy4xNjM1MTMxODM1OTM3NSw0MC42MjY5NTMxMjUsMjUsNDAuNjI1TTI1LDM3LjVDMjguNDg5NTAxOTUzMTI1LDM3LjUsMzEuNDQ1MzEyNSwzNi4yODkwNjI1LDMzLjg2NzMwOTU3MDMxMjUsMzMuODY3MTg3NUMzNi4yODkwNjI1LDMxLjQ0NTMxMjUsMzcuNSwyOC40ODk2MjQwMjM0Mzc1LDM3LjUsMjVDMzcuNSwyNC44MTc3NDkwMjM0Mzc1LDM3LjQ5MzcxMzM3ODkwNjI1LDI0LjYyODY2MjEwOTM3NSwzNy40ODEyNjIyMDcwMzEyNSwyNC40MzI3MzkyNTc4MTI1QzM3LjQ2ODY4ODk2NDg0Mzc1LDI0LjIzNjkzODQ3NjU2MjUsMzcuNDYyMDM2MTMyODEyNSwyNC4wNzQ0NjI4OTA2MjUsMzcuNDYwOTM3NSwyMy45NDUzMTI1QzM3LjMzMDgxMDU0Njg3NSwyNC43MDA1NjE1MjM0Mzc1LDM2Ljk3OTA2NDk0MTQwNjI1LDI1LjMyNTU2MTUyMzQzNzUsMzYuNDA2MzcyMDcwMzEyNSwyNS44MjAzMTI1QzM1LjgzMzMxMjk4ODI4MTI1LDI2LjMxNTA2MzQ3NjU2MjUsMzUuMTU2MjUsMjYuNTYyNSwzNC4zNzUsMjYuNTYyNUwzMS4yNSwyNi41NjI1QzMwLjM5MDUwMjkyOTY4NzUsMjYuNTYyNSwyOS42NTUyNzM0Mzc1LDI2LjI1NjcxMzg2NzE4NzUsMjkuMDQzNzYyMjA3MDMxMjUsMjUuNjQ1Mzg1NzQyMTg3NUMyOC40MzIzMTIwMTE3MTg3NSwyNS4wMzM5MzU1NDY4NzUsMjguMTI1OTE1NTI3MzQzNzUsMjQuMjk3ODUxNTYyNSwyOC4xMjUsMjMuNDM3NUwyOC4xMjUsMjEuODc1TDIxLjg3NSwyMS44NzVMMjEuODc1LDE4Ljc1QzIxLjg3NSwxNy44OTA2MjUsMjIuMTgxMjc0NDE0MDYyNSwxNy4xNTUxNTEzNjcxODc1LDIyLjc5Mzc2MjIwNzAzMTI1LDE2LjU0MzgyMzI0MjE4NzVDMjMuNDA2MTg4OTY0ODQzNzUsMTUuOTMyMjUwOTc2NTYyNSwyNC4xNDE2NjI1OTc2NTYyNSwxNS42MjU5NzY1NjI1LDI1LDE1LjYyNUwyNi41NjI1LDE1LjYyNUMyNi41NjI1LDE1LjAyNjAwMDk3NjU2MjUsMjYuNzI1NTg1OTM3NSwxNC40OTkwMjM0Mzc1LDI3LjA1MTU3NDcwNzAzMTI1LDE0LjA0MzgyMzI0MjE4NzVDMjcuMzc3NTAyNDQxNDA2MjUsMTMuNTg4NTAwOTc2NTYyNSwyNy43NzQ0NzUwOTc2NTYyNSwxMy4yMTcxNjMwODU5Mzc1LDI4LjI0MjA2NTQyOTY4NzUsMTIuOTI5Njg3NUMyNy43MjEzNzQ1MTE3MTg3NSwxMi43OTk0Mzg0NzY1NjI1LDI3LjE5NDIxMzg2NzE4NzUsMTIuNjk1MzEyNSwyNi42NjA5NDk3MDcwMzEyNSwxMi42MTcxODc1QzI2LjEyNzYyNDUxMTcxODc1LDEyLjUzOTA2MjUsMjUuNTczOTEzNTc0MjE4NzUsMTIuNSwyNSwxMi41QzIxLjUxMDQ5ODA0Njg3NSwxMi41LDE4LjU1NDY4NzUsMTMuNzEwOTM3NSwxNi4xMzI2OTA0Mjk2ODc1LDE2LjEzMjgxMjVDMTMuNzEwOTM3NSwxOC41NTQ2ODc1LDEyLjUsMjEuNTEwMzc1OTc2NTYyNSwxMi41LDI1TDIwLjMxMjUsMjVDMjIuMDMxMjUsMjUsMjMuNTAyNTAyNDQxNDA2MjUsMjUuNjExOTM4NDc2NTYyNSwyNC43MjY0NDA0Mjk2ODc1LDI2LjgzNTkzNzVDMjUuOTUwNDM5NDUzMTI1LDI4LjA1OTkzNjUyMzQzNzUsMjYuNTYyNSwyOS41MzEyNSwyNi41NjI1LDMxLjI1TDI2LjU2MjUsMzIuODEyNUwyMS44NzUsMzIuODEyNUwyMS44NzUsMzcuMTA5Mzc1QzIyLjM5NTkzNTA1ODU5Mzc1LDM3LjIzOTUwMTk1MzEyNSwyMi45MTA0NjE0MjU3ODEyNSwzNy4zMzc0MDIzNDM3NSwyMy40MTg3NjIyMDcwMzEyNSwzNy40MDMwNzYxNzE4NzVDMjMuOTI3MTI0MDIzNDM3NSwzNy40Njg3NSwyNC40NTQxNjI1OTc2NTYyNSwzNy41MDA5NzY1NjI1LDI1LDM3LjUiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IGZpbGwtb3BhY2l0eTogMTsiLz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9zdmc+" padding-top="0px" padding-bottom="0px" padding-right="0px" align="left" width="50px" padding-left="0px">
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
        <mj-group width="100%">
          <mj-column padding-top="10px" padding-right="0px" padding-bottom="0px" padding-left="0px" width="40%">
            <mj-button border-radius="20px 20px 20px 20px" font-size="12px" font-weight="700" color="#54728d" padding-top="0px" padding-bottom="0px" padding-right="10px" padding-left="0px" align="left" font-family="Aptos, Calibri, sans-serif" background-color="#d8fef3" border="0 none black">Read the article
            </mj-button>
          </mj-column>
        </mj-group>
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
            <mj-image src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSI1MCIgaWQ9InNjcmVlbnNob3QtNmU4NWYwZDQtNzg2ZS04MGI0LTgwMDctMzU3ZTc3MzAwZDM1IiB2aWV3Qm94PSIwIDAgNTAgNTAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBmaWxsPSJub25lIiB2ZXJzaW9uPSIxLjEiPjxnIGlkPSJzaGFwZS02ZTg1ZjBkNC03ODZlLTgwYjQtODAwNy0zNTdlNzczMDBkMzUiPjxnIGNsYXNzPSJmcmFtZS1jb250YWluZXItd3JhcHBlciI+PGcgY2xhc3M9ImZyYW1lLWNvbnRhaW5lci1ibHVyIj48ZyBjbGFzcz0iZnJhbWUtY29udGFpbmVyLXNoYWRvd3MiPjxnIGZpbGw9Im5vbmUiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTZlODVmMGQ0LTc4NmUtODBiNC04MDA3LTM1N2U3NzMwMGQzNSI+PHJlY3Qgcng9IjAiIHJ5PSIwIiB4PSIwIiB5PSIwIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBjbGFzcz0iZnJhbWUtYmFja2dyb3VuZCIvPjwvZz48ZyBjbGFzcz0iZnJhbWUtY2hpbGRyZW4iPjxnIGlkPSJzaGFwZS04ODY5MGZiOC02MjBmLTgwOTYtODAwNy00MTY5OWJlZGE4MTMiIHJ4PSIwIiByeT0iMCI+PGcgaWQ9InNoYXBlLTg4NjkwZmI4LTYyMGYtODA5Ni04MDA3LTQxNjk5YmVkYTgxNCI+PGcgY2xhc3M9ImZpbGxzIiBpZD0iZmlsbHMtODg2OTBmYjgtNjIwZi04MDk2LTgwMDctNDE2OTliZWRhODE0Ij48ZWxsaXBzZSBjeD0iMjUiIGN5PSIyNSIgcng9IjI1IiByeT0iMjUiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBzdHlsZT0iZmlsbDogcmdiKDE5NiwgMjE0LCAwKTsgZmlsbC1vcGFjaXR5OiAxOyIvPjwvZz48L2c+PGcgaWQ9InNoYXBlLTg4NjkwZmI4LTYyMGYtODA5Ni04MDA3LTQxNjk5YmVkYTgxNSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiByeD0iMCIgcnk9IjAiIHN0eWxlPSJmaWxsOiByZ2IoMCwgMCwgMCk7Ij48ZyBpZD0ic2hhcGUtODg2OTBmYjgtNjIwZi04MDk2LTgwMDctNDE2OTliZWRhODE2IiBzdHlsZT0iZGlzcGxheTogbm9uZTsiPjxnIGNsYXNzPSJmaWxscyIgaWQ9ImZpbGxzLTg4NjkwZmI4LTYyMGYtODA5Ni04MDA3LTQxNjk5YmVkYTgxNiI+PHJlY3Qgd2lkdGg9IjM1IiBoZWlnaHQ9IjM1IiB4PSI3LjUiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDAsIDEuMDAwMDAwLCAwLjAwMDAwMCwgMC4wMDAwMDApIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBmaWxsLW9wYWNpdHk6IDE7IiByeT0iMCIgZmlsbD0ibm9uZSIgcng9IjAiIHk9IjcuNSIvPjwvZz48L2c+PGcgaWQ9InNoYXBlLTg4NjkwZmI4LTYyMGYtODA5Ni04MDA3LTQxNjk5YmVkYTgxNyI+PGcgY2xhc3M9ImZpbGxzIiBpZD0iZmlsbHMtODg2OTBmYjgtNjIwZi04MDk2LTgwMDctNDE2OTliZWRhODE3Ij48cGF0aCBkPSJNMzAuODMzMzEyOTg4MjgxMjUsMTAuNDE2NzQ4MDQ2ODc1QzMxLjU3MjY5Mjg3MTA5Mzc1LDEwLjQxNjc0ODA0Njg3NSwzMi4xOTUwMDczMjQyMTg3NSwxMC45Njk5NzA3MDMxMjUsMzIuMjgxNDk0MTQwNjI1LDExLjcwNDM0NTcwMzEyNUwzMi4yOTE2ODcwMTE3MTg3NSwxMS44NzVMMzIuMjkxNjg3MDExNzE4NzUsMTMuMzMzMjUxOTUzMTI1TDMzLjc1LDEzLjMzMzI1MTk1MzEyNUMzNi4wNjY1ODkzNTU0Njg3NSwxMy4zMzMyNTE5NTMxMjUsMzcuOTgxODcyNTU4NTkzNzUsMTUuMTM4OTE2MDE1NjI1LDM4LjExNzY3NTc4MTI1LDE3LjQ1MTY2MDE1NjI1TDM4LjEyNSwxNy43MDgyNTE5NTMxMjVMMzguMTI1LDM1LjIwODI1MTk1MzEyNUMzOC4xMjUxODMxMDU0Njg3NSwzNy41MjQ5MDIzNDM3NSwzNi4zMTkzOTY5NzI2NTYyNSwzOS40NDAxODU1NDY4NzUsMzQuMDA2Nzc0OTAyMzQzNzUsMzkuNTc1OTI3NzM0Mzc1TDMzLjc1LDM5LjU4MzI1MTk1MzEyNUwxNi4yNSwzOS41ODMyNTE5NTMxMjVDMTMuOTMzNDEwNjQ0NTMxMjUsMzkuNTgzMjUxOTUzMTI1LDEyLjAxODEyNzQ0MTQwNjI1LDM3Ljc3NzgzMjAzMTI1LDExLjg4MjMyNDIxODc1LDM1LjQ2NTA4Nzg5MDYyNUwxMS44NzUsMzUuMjA4MjUxOTUzMTI1TDExLjg3NSwxNy43MDgyNTE5NTMxMjVDMTEuODc0ODE2ODk0NTMxMjUsMTUuMzkxNjAxNTYyNSwxMy42ODA2MDMwMjczNDM3NSwxMy40NzY1NjI1LDE1Ljk5MzIyNTA5NzY1NjI1LDEzLjM0MDU3NjE3MTg3NUwxNi4yNSwxMy4zMzMyNTE5NTMxMjVMMTcuNzA4MzEyOTg4MjgxMjUsMTMuMzMzMjUxOTUzMTI1TDE3LjcwODMxMjk4ODI4MTI1LDExLjg3NUMxNy43MDkyMjg1MTU2MjUsMTEuMTAzMjcxNDg0Mzc1LDE4LjMxMDk3NDEyMTA5Mzc1LDEwLjQ2NTgyMDMxMjUsMTkuMDgxMjM3NzkyOTY4NzUsMTAuNDIwNjU0Mjk2ODc1QzE5Ljg1MTUwMTQ2NDg0Mzc1LDEwLjM3NTQ4ODI4MTI1LDIwLjUyMzY4MTY0MDYyNSwxMC45Mzc5ODgyODEyNSwyMC42MTQ4MDcxMjg5MDYyNSwxMS43MDQzNDU3MDMxMjVMMjAuNjI1LDExLjg3NUwyMC42MjUsMTMuMzMzMjUxOTUzMTI1TDI5LjM3NSwxMy4zMzMyNTE5NTMxMjVMMjkuMzc1LDExLjg3NUMyOS4zNzUsMTEuMDY5NTgwMDc4MTI1LDMwLjAyNzk1NDEwMTU2MjUsMTAuNDE2NzQ4MDQ2ODc1LDMwLjgzMzMxMjk4ODI4MTI1LDEwLjQxNjc0ODA0Njg3NU0zNS4yMDgzMTI5ODgyODEyNSwyMC42MjVMMTQuNzkxNjg3MDExNzE4NzUsMjAuNjI1TDE0Ljc5MTY4NzAxMTcxODc1LDM0LjY2MTM3Njk1MzEyNUMxNC43OTE2ODcwMTE3MTg3NSwzNS42ODk2OTcyNjU2MjUsMTUuMzU0NjE0MjU3ODEyNSwzNi41MzY4NjUyMzQzNzUsMTYuMDc5NTI4ODA4NTkzNzUsMzYuNjUzNTY0NDUzMTI1TDE2LjI1LDM2LjY2Njc0ODA0Njg3NUwzMy43NSwzNi42NjY3NDgwNDY4NzVDMzQuNDk4MTA3OTEwMTU2MjUsMzYuNjY2NzQ4MDQ2ODc1LDM1LjExNTA1MTI2OTUzMTI1LDM1Ljg5Mzc5ODgyODEyNSwzNS4xOTgxODExNTIzNDM3NSwzNC44OTQ3NzUzOTA2MjVMMzUuMjA4MzEyOTg4MjgxMjUsMzQuNjYxMzc2OTUzMTI1WiIgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsgZmlsbC1vcGFjaXR5OiAxOyIvPjwvZz48L2c+PGcgaWQ9InNoYXBlLTg4NjkwZmI4LTYyMGYtODA5Ni04MDA3LTQxNjk5YmVkYTgxOCI+PGcgY2xhc3M9ImZpbGxzIiBpZD0iZmlsbHMtODg2OTBmYjgtNjIwZi04MDk2LTgwMDctNDE2OTliZWRhODE4Ij48cGF0aCBkPSJNMTkuMTY2Njg3MDExNzE4NzUsMjcuOTE2NzQ4MDQ2ODc1TDIyLjA4MzMxMjk4ODI4MTI1LDI3LjkxNjc0ODA0Njg3NUwyMi4wODMzMTI5ODgyODEyNSwzMC44MzMyNTE5NTMxMjVMMTkuMTY2Njg3MDExNzE4NzUsMzAuODMzMjUxOTUzMTI1WiIgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsgZmlsbC1vcGFjaXR5OiAxOyIvPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L3N2Zz4=" padding-top="0px" padding-bottom="0px" padding-right="0px" align="left" width="50px" padding-left="0px">
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
