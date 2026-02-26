// iOS AI Chatbot with SwiftUI + OpenAI
import SwiftUI
import OpenAI

struct ChatView: View {
    @StateObject private var viewModel = ChatViewModel()
    @State private var inputText = ""
    
    var body: some View {
        VStack {
            // Messages
            ScrollView {
                LazyVStack(alignment: .leading, spacing: 16) {
                    ForEach(viewModel.messages) { message in
                        MessageRow(message: message)
                    }
                    
                    if viewModel.isLoading {
                        HStack {
                            ProgressView()
                            Text("AI přemýšlí...")
                                .foregroundColor(.gray)
                        }
                    }
                }
                .padding()
            }
            
            // Input
            HStack {
                TextField("Napiš zprávu...", text: $inputText)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                
                Button(action: sendMessage) {
                    Image(systemName: "paperplane.fill")
                        .foregroundColor(.white)
                        .padding(10)
                        .background(Color.blue)
                        .clipShape(Circle())
                }
                .disabled(inputText.isEmpty || viewModel.isLoading)
            }
            .padding()
        }
        .navigationTitle("AI Chat")
    }
    
    private func sendMessage() {
        viewModel.sendMessage(inputText)
        inputText = ""
    }
}

struct Message: Identifiable {
    let id = UUID()
    let role: String
    let content: String
}

struct MessageRow: View {
    let message: Message
    
    var body: some View {
        HStack {
            if message.role == "user" {
                Spacer()
            }
            
            VStack(alignment: message.role == "user" ? .trailing : .leading) {
                Text(message.content)
                    .padding(12)
                    .background(message.role == "user" ? Color.blue : Color.gray.opacity(0.2))
                    .foregroundColor(message.role == "user" ? .white : .primary)
                    .cornerRadius(16)
            }
            
            if message.role == "assistant" {
                Spacer()
            }
        }
    }
}

@MainActor
class ChatViewModel: ObservableObject {
    @Published var messages: [Message] = []
    @Published var isLoading = false
    
    private let openAI = OpenAI(apiToken: "YOUR_API_KEY")
    
    func sendMessage(_ text: String) {
        let userMessage = Message(role: "user", content: text)
        messages.append(userMessage)
        isLoading = true
        
        Task {
            do {
                let query = ChatQuery(
                    messages: messages.map { 
                        Chat(role: .init(rawValue: $0.role)!, content: $0.content)
                    },
                    model: .gpt4_turbo
                )
                
                let result = try await openAI.chats(query: query)
                
                if let response = result.choices.first?.message.content?.string {
                    let aiMessage = Message(role: "assistant", content: response)
                    messages.append(aiMessage)
                }
            } catch {
                print("Error: \(error)")
            }
            
            isLoading = false
        }
    }
}

// Package.swift dependencies:
// .package(url: "https://github.com/MacPaw/OpenAI", from: "0.2.0")
