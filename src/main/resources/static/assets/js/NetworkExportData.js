const NetworkExportData = (function(){
    function NetworkExportData(name, networkData){
        this.name = name;
        this.nodes = networkData.nodes.get();
        this.edges = networkData.edges.get();
    
        this.nodes = cleanNodes(this.nodes);
    }
    
    // removes excessive properties from the Vis framework that we don't use, like the node font
    function cleanNodes(nodes){
        let cleanNodes = [];
    
        nodes.forEach(node => {
            let cleanNode = {
                id: node.id,
                label: node.label,
                x: node.x,
                y: node.y
            }
            
            cleanNodes.push(cleanNode);
        });
        
        return cleanNodes;
    }

    return NetworkExportData;
})();
 
 
