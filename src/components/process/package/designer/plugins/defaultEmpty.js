export default (key, name, desp, rejectStatus, type) => {
    if (!type) type = "camunda";
    const TYPE_TARGET = {
        activiti: "http://activiti.org/bpmn",
        camunda: "http://bpmn.io/schema/bpmn",
        flowable: "http://flowable.org/bpmn",
    };
    return `<?xml version="1.0" encoding="UTF-8"?>
<definitions 
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
  id="diagram_${key}"
  targetNamespace="${TYPE_TARGET[type]}">
  <process id="${key}" name="${name}" desp="${desp}" rejectStatus="${rejectStatus}" isExecutable="true">
  </process>
  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="${key}">
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;
};
