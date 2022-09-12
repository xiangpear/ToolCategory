export default function print(row) {
    let str = "";
    if (Array.isArray(row)) {
        row.forEach((item) => {
            str += `<Print><EntityTypeId>安全工器具</EntityTypeId><Code>${item.rfid}</Code><Text>工器具名称：${item.toolCategory.toolCategoryName}</Text><Text>工器具编号：${
                item.toolAlias || ""
            }</Text><Text>工器具编码：${item.rfid}</Text></Print>`;
        });
    } else if (Object.prototype.toString.call(row) === "[object Object]") {
        str = `<Print><EntityTypeId>安全工器具</EntityTypeId><Code>${row.rfid}</Code><Text>工器具名称：${row.toolCategory.toolCategoryName}</Text><Text>工器具编号：${
            row.toolAlias || ""
        }</Text><Text>工器具编码：${row.rfid}</Text></Print>`;
    }
    //<?xml version=\"1.0\" encoding=\"utf-8\" ?><Data><Print><EntityTypeId>安全工器具</EntityTypeId><Code>123456789</Code><Text>工器具名称：安全帽</Text><Text>工器具编号：24号安全帽</Text><Text>工器具编码：124351321511234123532252</Text></Print></Data>
    let xml = `<?xml version=\"1.0\" encoding=\"utf-8\" ?><Data>${str}</Data>`;
    wewin.LabelPrint(xml, {
        imgPath: "./wewin/labelimage",
    });
}
