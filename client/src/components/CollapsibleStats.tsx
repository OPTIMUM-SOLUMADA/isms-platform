import { PropsWithChildren, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Button } from './ui/button';

export default function CollapsibleStats({ children }: PropsWithChildren) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className='relative'>
            <AnimatePresence initial={false}>
                {isOpen && (
                    <motion.div
                        key="stats-grid"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
            <Button
                onClick={() => setIsOpen((prev) => !prev)}
                variant='ghost'
                size='sm'
                className='absolute -right-0 translate-x-full top-0'
            >
                {!isOpen ? <ChevronDownIcon /> : <ChevronUpIcon />}
            </Button>
        </div>
    );
}
