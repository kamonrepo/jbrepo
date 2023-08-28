import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getBRCByBRId } from '../../actions/billruncandidate';

const useCallbackRef = (callback) => {
    const callbackRef = useRef(callback);
    useLayoutEffect(() => {
        callbackRef.current = callback;
    }, [callback])

    return callbackRef;
}

export const useFetch = (options) => {

    const [custom, setCustomData] = useState([{}]);
    const brc = useSelector(state => state.billruncandidates);

    const [data, setData] = useState(null);
    const savedOnsuccess = useCallbackRef(options.onSuccess);

    useEffect(() => {
        console.log("useFetch useEffect");
        if(options.url){
            let isCancelled = false;
            fetch(options.url)
            .then((response) => response.json())
            .then((json) => {
                if(!isCancelled) {
                    savedOnsuccess.current?.(json);
                    setData(json)
                }
            });
            return () => {
                isCancelled = true;
            }
        }
    }, [options.url]);

    return {
        data,
    };
};