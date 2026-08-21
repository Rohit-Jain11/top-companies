export function FaqAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  if (faqs.length === 0) return null;

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <details key={index} className="group glass2 open:glass bg-white/20! rounded-[25px]">
          <summary className="flex items-center gap-2.5 text-lg leading-7 font-semibold p-3 xl:p-5.5 group-open:pb-2.5 xl:group-open:pb-4.5 cursor-pointer text-foreground group-open:text-primary">
            <span className="group-open:rotate-180">
              <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none" className="text-[#555555] group-open:text-primary transition-colors">
                <path d="M11.2537 15.1387L17.2088 21.0938L23.1639 15.1387" stroke="currentColor" strokeWidth="1.70146" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
            {faq.question}
          </summary>
          <p className="text-lg leading-7 text-secondary pr-3 xl:pr-5.5 pb-5.5 xl:pb-5.5 pl-14 xl:pl-16.5">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
