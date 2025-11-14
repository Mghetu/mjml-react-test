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
    'MEM-end-of-section-2-banners',
    'MEM · 2-banners',
    'MEM',
    `
 <mj-section padding-top="10px" padding-bottom="0px" background-color="#ffffff">
        <mj-group>
          <mj-column width="50%" padding-top="0px" padding-bottom="0px">
            <mj-image src="https://placehold.co/300x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
            </mj-image>
          </mj-column>
          <mj-column width="50%" padding-top="0px" padding-bottom="0px">
            <mj-image src="https://placehold.co/300x80" padding-top="0px" padding-bottom="0px" padding-right="0px" padding-left="0px">
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
          <mj-button padding-right="10px" padding-left="10px" border-radius="0px 0 0 0" background-color="#ffffff" border="0px none black" href="https://bit.ly/482TEIj">
            <span data-teams="true" style="color:#86bd40;font-weight:700;font-size:18px;text-decoration:underline;align:center;font-family:Aptos, Calibri, sans-serif;">HUN</span>
          </mj-button>
        </mj-column>
        <mj-column width="50%" padding-top="0px" padding-bottom="0px">
          <mj-button padding-right="10px" padding-left="10px" border-radius="0px 0 0 0" background-color="#ffffff" border="0px none black" href="https://bit.ly/4oDDSdL">
            <span data-teams="true" style="color:#86bd40;font-weight:700;font-size:18px;text-decoration:underline;align:center;font-family:Aptos, Calibri, sans-serif;">SOUTH</span>
          </mj-button>
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
