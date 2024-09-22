import React from 'react'

const BankList = () => {
    return (
        <>
            <div className="search-bar">
                <input type="text" placeholder="Search for a bank..." id="searchInput" />
            </div>
            <div className="bank-list">
                <input type="radio" id="bank1" name="bank" value="bank1" />
                <label htmlFor="bank1"><span>Bank 1</span></label>

                <input type="radio" id="bank2" name="bank" value="bank2" />
                <label htmlFor="bank2"><span>Bank 2</span></label>

                <input type="radio" id="bank3" name="bank" value="bank3" />
                <label htmlFor="bank3"><span>Bank 3</span></label>

                <input type="radio" id="bank4" name="bank" value="bank4" />
                <label htmlFor="bank4"><span>Bank 4</span></label>

                <input type="radio" id="bank5" name="bank" value="bank5" />
                <label htmlFor="bank5"><span>Bank 5</span></label>

                <input type="radio" id="bank6" name="bank" value="bank6" />
                <label htmlFor="bank6"><span>Bank 6</span></label>

                <button className="load-more">Load More</button>
            </div>
        </>
    )
}

export default BankList