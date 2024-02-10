
import {Heading, IconFilters, IconCaret, IconXMark, Text, Section} from '~/components';
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from '@remix-run/react';
import { useState } from 'react';
export function CollectionFilter({minPrice, maxPrice}) {

    const [minPriceRange,setminPriceRange] = useState(minPrice);
    const [maxPriceRange,setmaxPriceRange] = useState(maxPrice);
    const OnClickSort = event => {
        if(event.target.closest('.sort-title')) {
            event.target.closest('.collection-sorting-container').classList.toggle('show');
        }       
    }

    const OnClickFilter = event => {
        if(event.target.closest('.filter-title')) {
            event.target.closest('.collection-filter-container').classList.toggle('show');
        }       
    }
    
    const onSortParam = event => {
        const url = new URL(window.location.href);
        url.searchParams.set('sortkey', event.target.closest('li').getAttribute('data-sort-key'));
        url.searchParams.set('reverse', event.target.closest('li').getAttribute('data-sort-reverse'));
        if(event.target.closest('.collection-sorting-container').classList.contains('show')) {
            window.location.href = url.toString();
        }      
    }
    
    const onFilterParam = event => {
        event.target.closest('.nested-list').classList.toggle('show');
    }

    const onFilterAvailabilityParam = event => {
        const url = new URL(window.location.href);
        url.searchParams.delete('price');
        url.searchParams.delete('min');
        url.searchParams.delete('max');
        url.searchParams.set('filter.v.availability', event.target.closest('li').getAttribute('data-filter-value'));
        if(event.target.closest('.nested-list').classList.contains('show')) {
            window.location.href = url.toString();
        }      
       
    }


    const onChangeMin = event => {
        event.target.value = setminPriceRange(event.target.value);
    }

    const onChangeMax = event => {
        event.target.value = setmaxPriceRange(event.target.value);
    }

    const onFilterPriceParam = event => {
        if(event.target.closest('.filter-price')) {
            event.target.closest('.collection-price-container').classList.toggle('show');
        }        
    }

    const onSubmitFilter = event => {
        const url = new URL(window.location.href);
        url.searchParams.delete('availability');
        url.searchParams.set('filter.v.availability', true);
        url.searchParams.set('min', event.target.closest('.price-range-container').querySelector('#mininputrange').value);
        url.searchParams.set('max', event.target.closest('.price-range-container').querySelector('#maxinputrange').value);
        if(event.target.closest('.collection-price-container').classList.contains('show')) {
            window.location.href = url.toString();
        }      
    }
    const [params] = useSearchParams();
    const location = useLocation();
    // console.log('sd', params, location)
    return (
        <Section>
            <div className="collection-filter-sorting-container">
                <div className="collection-filter-container customFilters flex gap-2">
                    <p className="filter-title">Filter By : </p>
                    <div className="nested-availability-filter flex gap-4">
                        <div className="nested-list" data-filter-key="STOCK" onClick={onFilterParam}>
                        	<span className='flex'><span>Availability</span><IconCaret /></span>
                            <ul>
                                <li data-filter-value="true" onClick={onFilterAvailabilityParam}>In stock </li>
                                <li data-filter-value="false" onClick={onFilterAvailabilityParam}>Out of stock</li>
                                <li data-filter-value="both" onClick={onFilterAvailabilityParam}>Both</li>
                            </ul>
                        </div>
                        <div className="collection-price-container" onClick={onFilterPriceParam}>
                            <div className="filter-price flex">
                            
                            <span>Price </span><IconCaret />
                            </div>
                            <div className="price-range-container">
                                <label htmlFor="mininputrange">Min (between 0 and 2000):</label>
                                <input type="range" id="mininputrange" name="mininputrange" min="0" value={minPriceRange} max="2000" step={1} onChange={onChangeMin} />
                                <p>{minPriceRange}</p>
                                <label htmlFor="mininputrange">Max (between 0 and 10000):</label>
                                <input type="range" id="maxinputrange" name="maxinputrange" min="0" value={maxPriceRange} max="10000" step={1} onChange={onChangeMax} />
                                <p>{maxPriceRange}</p>
                                <button type="button" onClick={onSubmitFilter}>Apply</button>
                            </div>
                        </div>
                    </div>
                </div>   
               {/* <div className="collection-sorting-container" onClick={OnClickSort}>
                    <p className="sort-title">Sort By <IconCaret /></p>
                    <ul>
                        <li data-sort-key="MANUAL" data-sort-reverse="false" onClick={onSortParam}>Featured</li>
                        <li data-sort-key="TITLE" data-sort-reverse="false" onClick={onSortParam}>Alphabetically, A-Z</li>
                        <li data-sort-key="PRICE" data-sort-reverse="true" onClick={onSortParam}>Price, High-low </li>
                    </ul>
                </div>*/}
            </div>    
        </Section>
    )
}