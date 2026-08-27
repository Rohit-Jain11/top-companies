import React from 'react';
import Link from 'next/link';

const TermsAndConditions = () => {
    return (
        <>
            <section className='px-5 pt-10 xl:pt-24 pb-10 xl:pb-12.5 relative z-1 after:absolute after:top-[-70%] after:left-0 after:w-full after:h-full after:bg-[linear-gradient(0deg,rgba(255,255,255,0)_0%,rgba(217,43,66,1)_100%)] after:z-[-1] after:opacity-[0.2]'>
                <div className="container-8xl">
                    <div className="max-w-180 mx-auto">
                        <div className='flex flex-wrap items-center justify-center gap-1.5'>
                            <Link href="/" className='text-sm leading-6 text-secondary block uppercase'>home</Link>
                            <span className='text-sm leading-6 text-secondary block'>/</span>
                            <span className='text-sm leading-6 text-foreground block uppercase font-medium'>Terms & Conditions</span>
                        </div>
                        <h1 className='font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal my-2 xl:my-7.5 text-center'>Our Terms, <span className="text-primary font-light italic">Your Understanding</span></h1>
                        <p className="text-center text-lg leading-7 text-secondary">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since 1966.</p>
                    </div>
                </div>
            </section>

            <section className="px-5 pt-6 xl:pt-12.5 pb-10 xl:pb-12.5 relative z-1 overflow-hidden">
                <div className="container-8xl">
                    <h2 className="font-fraunces text-foreground text-[22px] xl:text-[28px] leading-7 xl:leading-11 tracking-[-0.56px] font-normal mb-4">The <span className="text-primary font-light italic inline-block">journey</span> that shaped us</h2>
                    <p className='text-secondary text-lg leading-7 mb-4'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset&apos;s Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum.</p>
                    <p className='text-secondary text-lg leading-7'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since 1966, when designers at Letraset and James Mosley.</p>

                    <h2 className="font-fraunces text-foreground text-[22px] xl:text-[28px] leading-7 xl:leading-11 tracking-[-0.56px] font-normal mb-4 mt-10">Why do we use it</h2>
                    <p className='text-secondary text-lg leading-7 mb-4'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset&apos;s Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum.</p>
                    <p className='text-secondary text-lg leading-7'>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&apos;s standard dummy text ever since 1966, when designers at Letraset and James Mosley.</p>
                </div>
            </section>
        </>
    )
};

export default TermsAndConditions;
