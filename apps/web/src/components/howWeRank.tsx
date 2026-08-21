"use client";

import Image from 'next/image';
import { useEffect, useState } from "react";

const HowWeRank = () => {
    const [active, setActive] = useState("signal");

    useEffect(() => {
        const handleScroll = () => {
            const sections = ["signal", "work", "trust"];
            const current = sections.reduce((active, id) => {
                const el = document.getElementById(id);
                if (el && el.getBoundingClientRect().top <= 150) {
                    return id;
                }
                return active;
            }, "signal");
            setActive(current);
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <div className="flex flex-wrap">
            <div className="lg:basis-[30%] max-w-full w-full lg:max-w-[30%] lg:shrink-0 mb-6 lg:mb-0">
                <div className='sticky top-20'>
                    <ul className="lg:max-w-58.25 w-full">
                        <li>
                            <button onClick={() => scrollToSection("signal")} className={`text-lg leading-7 py-2.5 border-b block w-full text-left cursor-pointer ${active === "signal" ? 'text-primary border-primary font-semibold' : 'text-secondary border-primary/10 font-normal'}`}>Signal detection</button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection("work")} className={`text-lg leading-7 py-2.5 border-b block w-full text-left cursor-pointer ${active === "work" ? 'text-primary border-primary font-semibold' : 'text-secondary border-primary/10 font-normal'}`}>Work quality</button>
                        </li>
                        <li>
                            <button onClick={() => scrollToSection("trust")} className={`text-lg leading-7 py-2.5 border-b block w-full text-left cursor-pointer ${active === "trust" ? 'text-primary border-primary font-semibold' : 'text-secondary border-primary/10 font-normal'}`}>Public trust</button>
                        </li>
                    </ul>
                    <div className='mt-10.75 hidden lg:block'>
                        <Image src={'../pay-to-rank-shape.svg'} alt='' width={217} height={219} />
                    </div>
                </div>
            </div>
            <div className="lg:basis-[70%] lg:max-w-[70%] lg:shrink-0">
                <div className="space-y-6 xl:space-y-15">
                    <div id="signal" className="scroll-mt-24 shadow-card p-5 xl:p-7 rounded-2xl bg-white">
                        <span className="font-fraunces text-[28px] xl:text-[42px] leading-9 xl:leading-10.5 font-light block text-primary">01</span>
                        <span className="uppercase text-secondary text-sm leading-6 block my-2.5">Signal detection</span>
                        <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal">
                            <span className="text-primary font-light italic inline-block">Real reviews.</span> Verified, not assumed.
                        </h2>
                        <p className="text-lg leading-7 text-secondary font-normal mt-3 xl:mt-4 mb-4 xl:mb-7.5">We pull reviews straight from Clutch, G2, Trustpilot, and GoodFirms — cross-checked to filter out fake or duplicate ratings.</p>
                        <div className="flex flex-wrap justify-between">
                            <div className="flex flex-col justify-between lg:basis-[51%] max-w-full w-full lg:max-w-[51%] gap-5">
                                <ul className="space-y-2.5">
                                    <li className="text-lg leading-7 text-secondary font-normal flex items-center gap-2.5">
                                        <span className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 18.3332C5.39746 18.3332 1.66663 14.6023 1.66663 9.99984C1.66663 5.39734 5.39746 1.6665 9.99996 1.6665C14.6025 1.6665 18.3333 5.39734 18.3333 9.99984C18.3333 14.6023 14.6025 18.3332 9.99996 18.3332ZM9.01913 11.7832L6.71496 9.47734L5.83329 10.359L8.43246 12.9598C8.58873 13.1161 8.80066 13.2038 9.02163 13.2038C9.2426 13.2038 9.45452 13.1161 9.61079 12.9598L14.5708 8.0015L13.6858 7.1165L9.01913 11.7832Z" fill="#D92B42"/>
                                            </svg>
                                        </span>
                                        Multi-platform review scanning
                                    </li>
                                    <li className="text-lg leading-7 text-secondary font-normal flex items-center gap-2.5">
                                        <span className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 18.3332C5.39746 18.3332 1.66663 14.6023 1.66663 9.99984C1.66663 5.39734 5.39746 1.6665 9.99996 1.6665C14.6025 1.6665 18.3333 5.39734 18.3333 9.99984C18.3333 14.6023 14.6025 18.3332 9.99996 18.3332ZM9.01913 11.7832L6.71496 9.47734L5.83329 10.359L8.43246 12.9598C8.58873 13.1161 8.80066 13.2038 9.02163 13.2038C9.2426 13.2038 9.45452 13.1161 9.61079 12.9598L14.5708 8.0015L13.6858 7.1165L9.01913 11.7832Z" fill="#D92B42"/>
                                            </svg>
                                        </span>
                                        Fake & duplicate review filtering
                                    </li>
                                    <li className="text-lg leading-7 text-secondary font-normal flex items-center gap-2.5">
                                        <span className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 18.3332C5.39746 18.3332 1.66663 14.6023 1.66663 9.99984C1.66663 5.39734 5.39746 1.6665 9.99996 1.6665C14.6025 1.6665 18.3333 5.39734 18.3333 9.99984C18.3333 14.6023 14.6025 18.3332 9.99996 18.3332ZM9.01913 11.7832L6.71496 9.47734L5.83329 10.359L8.43246 12.9598C8.58873 13.1161 8.80066 13.2038 9.02163 13.2038C9.2426 13.2038 9.45452 13.1161 9.61079 12.9598L14.5708 8.0015L13.6858 7.1165L9.01913 11.7832Z" fill="#D92B42"/>
                                            </svg>
                                        </span>
                                        Verified client identity checks
                                    </li>
                                    <li className="text-lg leading-7 text-secondary font-normal flex items-center gap-2.5">
                                        <span className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 18.3332C5.39746 18.3332 1.66663 14.6023 1.66663 9.99984C1.66663 5.39734 5.39746 1.6665 9.99996 1.6665C14.6025 1.6665 18.3333 5.39734 18.3333 9.99984C18.3333 14.6023 14.6025 18.3332 9.99996 18.3332ZM9.01913 11.7832L6.71496 9.47734L5.83329 10.359L8.43246 12.9598C8.58873 13.1161 8.80066 13.2038 9.02163 13.2038C9.2426 13.2038 9.45452 13.1161 9.61079 12.9598L14.5708 8.0015L13.6858 7.1165L9.01913 11.7832Z" fill="#D92B42"/>
                                            </svg>
                                        </span>
                                        Review recency weighting
                                    </li>
                                </ul>
                                <span className="text-base leading-5.5 font-semibold text-secondary border border-border rounded-full bg-white py-2 px-4.5 inline-block max-w-fit text-center">40,000+ reviews scanned across 310+ categories</span>
                            </div>
                            <div className="lg:basis-[47%] lg:max-w-[47%] mt-5 lg:mt-0">
                                <Image src={'/step1.webp'} alt="" width={412} height={286} className="rounded-[20px]" />
                            </div>
                        </div>
                    </div>
                    
                    <div id="work" className="scroll-mt-24 shadow-card p-5 xl:p-7 rounded-2xl bg-white">
                        <span className="font-fraunces text-[28px] xl:text-[42px] leading-9 xl:leading-10.5 font-light block text-primary">02</span>
                        <span className="uppercase text-secondary text-sm leading-6 block my-2.5">Work quality</span>
                        <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal">
                            <span className="text-primary font-light italic inline-block">Rated</span> on real work. Not a sales pitch.
                        </h2>
                        <p className="text-lg leading-7 text-secondary font-normal mt-3 xl:mt-4 mb-4 xl:mb-7.5">We pull reviews straight from Clutch, G2, Trustpilot, and GoodFirms — cross-checked to filter out fake or duplicate ratings.</p>
                        <div className="flex flex-wrap justify-between">
                            <div className="flex flex-col justify-between lg:basis-[51%] max-w-full w-full lg:max-w-[51%] gap-5">
                                <ul className="space-y-2.5">
                                    <li className="text-lg leading-7 text-secondary font-normal flex items-center gap-2.5">
                                        <span className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 18.3332C5.39746 18.3332 1.66663 14.6023 1.66663 9.99984C1.66663 5.39734 5.39746 1.6665 9.99996 1.6665C14.6025 1.6665 18.3333 5.39734 18.3333 9.99984C18.3333 14.6023 14.6025 18.3332 9.99996 18.3332ZM9.01913 11.7832L6.71496 9.47734L5.83329 10.359L8.43246 12.9598C8.58873 13.1161 8.80066 13.2038 9.02163 13.2038C9.2426 13.2038 9.45452 13.1161 9.61079 12.9598L14.5708 8.0015L13.6858 7.1165L9.01913 11.7832Z" fill="#D92B42"/>
                                            </svg>
                                        </span>
                                        Portfolio depth & case study count
                                    </li>
                                    <li className="text-lg leading-7 text-secondary font-normal flex items-center gap-2.5">
                                        <span className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 18.3332C5.39746 18.3332 1.66663 14.6023 1.66663 9.99984C1.66663 5.39734 5.39746 1.6665 9.99996 1.6665C14.6025 1.6665 18.3333 5.39734 18.3333 9.99984C18.3333 14.6023 14.6025 18.3332 9.99996 18.3332ZM9.01913 11.7832L6.71496 9.47734L5.83329 10.359L8.43246 12.9598C8.58873 13.1161 8.80066 13.2038 9.02163 13.2038C9.2426 13.2038 9.45452 13.1161 9.61079 12.9598L14.5708 8.0015L13.6858 7.1165L9.01913 11.7832Z" fill="#D92B42"/>
                                            </svg>
                                        </span>
                                        Repeat client detection
                                    </li>
                                    <li className="text-lg leading-7 text-secondary font-normal flex items-center gap-2.5">
                                        <span className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 18.3332C5.39746 18.3332 1.66663 14.6023 1.66663 9.99984C1.66663 5.39734 5.39746 1.6665 9.99996 1.6665C14.6025 1.6665 18.3333 5.39734 18.3333 9.99984C18.3333 14.6023 14.6025 18.3332 9.99996 18.3332ZM9.01913 11.7832L6.71496 9.47734L5.83329 10.359L8.43246 12.9598C8.58873 13.1161 8.80066 13.2038 9.02163 13.2038C9.2426 13.2038 9.45452 13.1161 9.61079 12.9598L14.5708 8.0015L13.6858 7.1165L9.01913 11.7832Z" fill="#D92B42"/>
                                            </svg>
                                        </span>
                                        Delivery consistency signals
                                    </li>
                                    <li className="text-lg leading-7 text-secondary font-normal flex items-center gap-2.5">
                                        <span className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 18.3332C5.39746 18.3332 1.66663 14.6023 1.66663 9.99984C1.66663 5.39734 5.39746 1.6665 9.99996 1.6665C14.6025 1.6665 18.3333 5.39734 18.3333 9.99984C18.3333 14.6023 14.6025 18.3332 9.99996 18.3332ZM9.01913 11.7832L6.71496 9.47734L5.83329 10.359L8.43246 12.9598C8.58873 13.1161 8.80066 13.2038 9.02163 13.2038C9.2426 13.2038 9.45452 13.1161 9.61079 12.9598L14.5708 8.0015L13.6858 7.1165L9.01913 11.7832Z" fill="#D92B42"/>
                                            </svg>
                                        </span>
                                        Team size vs. project scale match
                                    </li>
                                </ul>
                                <span className="text-base leading-5.5 font-semibold text-secondary border border-border rounded-full bg-white py-2 px-4.5 inline-block max-w-fit text-center">Portfolio data cross-checked from 5+ public sources</span>
                            </div>
                            <div className="lg:basis-[47%] lg:max-w-[47%] mt-5 lg:mt-0">
                                <Image src={'/step2.webp'} alt="" width={412} height={315} className="rounded-[20px]" />
                            </div>
                        </div>
                    </div>
                    
                    <div id="trust" className="scroll-mt-24 shadow-card p-5 xl:p-7 rounded-2xl bg-white">
                        <span className="font-fraunces text-[28px] xl:text-[42px] leading-9 xl:leading-10.5 font-light block text-primary">03</span>
                        <span className="uppercase text-secondary text-sm leading-6 block my-2.5">Public trust</span>
                        <h2 className="font-fraunces text-foreground text-[32px] xl:text-[54px] leading-10 xl:leading-14.25 tracking-[-1.62px] font-normal">
                            What the <span className="text-primary font-light italic inline-block">internet</span> actually says.
                        </h2>
                        <p className="text-lg leading-7 text-secondary font-normal mt-3 xl:mt-4 mb-4 xl:mb-7.5">We scan public mentions, backlinks, and sentiment to see how a company is genuinely perceived — beyond its own website.</p>
                        <div className="flex flex-wrap justify-between">
                            <div className="flex flex-col justify-between lg:basis-[51%] max-w-full w-full lg:max-w-[51%] gap-5">
                                <ul className="space-y-2.5">
                                    <li className="text-lg leading-7 text-secondary font-normal flex items-center gap-2.5">
                                        <span className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 18.3332C5.39746 18.3332 1.66663 14.6023 1.66663 9.99984C1.66663 5.39734 5.39746 1.6665 9.99996 1.6665C14.6025 1.6665 18.3333 5.39734 18.3333 9.99984C18.3333 14.6023 14.6025 18.3332 9.99996 18.3332ZM9.01913 11.7832L6.71496 9.47734L5.83329 10.359L8.43246 12.9598C8.58873 13.1161 8.80066 13.2038 9.02163 13.2038C9.2426 13.2038 9.45452 13.1161 9.61079 12.9598L14.5708 8.0015L13.6858 7.1165L9.01913 11.7832Z" fill="#D92B42"/>
                                            </svg>
                                        </span>
                                        Domain & industry authority scoring
                                    </li>
                                    <li className="text-lg leading-7 text-secondary font-normal flex items-center gap-2.5">
                                        <span className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 18.3332C5.39746 18.3332 1.66663 14.6023 1.66663 9.99984C1.66663 5.39734 5.39746 1.6665 9.99996 1.6665C14.6025 1.6665 18.3333 5.39734 18.3333 9.99984C18.3333 14.6023 14.6025 18.3332 9.99996 18.3332ZM9.01913 11.7832L6.71496 9.47734L5.83329 10.359L8.43246 12.9598C8.58873 13.1161 8.80066 13.2038 9.02163 13.2038C9.2426 13.2038 9.45452 13.1161 9.61079 12.9598L14.5708 8.0015L13.6858 7.1165L9.01913 11.7832Z" fill="#D92B42"/>
                                            </svg>
                                        </span>
                                        Sentiment analysis across mentions
                                    </li>
                                    <li className="text-lg leading-7 text-secondary font-normal flex items-center gap-2.5">
                                        <span className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 18.3332C5.39746 18.3332 1.66663 14.6023 1.66663 9.99984C1.66663 5.39734 5.39746 1.6665 9.99996 1.6665C14.6025 1.6665 18.3333 5.39734 18.3333 9.99984C18.3333 14.6023 14.6025 18.3332 9.99996 18.3332ZM9.01913 11.7832L6.71496 9.47734L5.83329 10.359L8.43246 12.9598C8.58873 13.1161 8.80066 13.2038 9.02163 13.2038C9.2426 13.2038 9.45452 13.1161 9.61079 12.9598L14.5708 8.0015L13.6858 7.1165L9.01913 11.7832Z" fill="#D92B42"/>
                                            </svg>
                                        </span>
                                        Backlink quality checks
                                    </li>
                                    <li className="text-lg leading-7 text-secondary font-normal flex items-center gap-2.5">
                                        <span className="shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 18.3332C5.39746 18.3332 1.66663 14.6023 1.66663 9.99984C1.66663 5.39734 5.39746 1.6665 9.99996 1.6665C14.6025 1.6665 18.3333 5.39734 18.3333 9.99984C18.3333 14.6023 14.6025 18.3332 9.99996 18.3332ZM9.01913 11.7832L6.71496 9.47734L5.83329 10.359L8.43246 12.9598C8.58873 13.1161 8.80066 13.2038 9.02163 13.2038C9.2426 13.2038 9.45452 13.1161 9.61079 12.9598L14.5708 8.0015L13.6858 7.1165L9.01913 11.7832Z" fill="#D92B42"/>
                                            </svg>
                                        </span>
                                        Press & publication mentions
                                    </li>
                                </ul>
                                <span className="text-base leading-5.5 font-semibold text-secondary border border-border rounded-full bg-white py-2 px-4.5 inline-block max-w-fit text-center">Zero human bias · refreshed every 6 hours</span>
                            </div>
                            <div className="lg:basis-[47%] lg:max-w-[47%] mt-5 lg:mt-0">
                                <Image src={'/step3.webp'} alt="" width={453} height={315} className="rounded-[20px]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default HowWeRank;
