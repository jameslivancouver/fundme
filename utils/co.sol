function fund() public payable {
    require(
        msg.value.getConversionRate(s_priceFeed) >= MINIMUM_USD,
        "You need to spend more ETH!"
    );
    s_addressToAmountFunded[msg.sender] += msg.value;
    s_funders.push(msg.sender);
}
